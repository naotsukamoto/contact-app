import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, query, Timestamp, updateDoc, setDoc, where } from "firebase/firestore";

import { auth } from "../../firebase";
import { Home } from "./Home";
import { Settings } from "./Settings";
import { Login } from "./Login";
import { RouteAuthGuard } from "../router/RouteAuthGuard";
import { toastFunc } from "../../utils/toastFunc";

jest.mock("../../firebase", () => ({
  auth: { currentUser: null },
  db: {},
  googleAuthProvider: {},
  twitterAuthProvider: {},
}));
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, callback) => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) callback(_auth.currentUser);
    });
    return () => { active = false; };
  }),
  signOut: jest.fn(),
}));
jest.mock("@firebase/auth", () => jest.requireMock("firebase/auth"));
jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  collection: jest.fn((_db, ...segments) => ({
    path: segments.join("/"),
    withConverter() { return this; },
  })),
  query: jest.fn((ref) => ref),
  where: jest.fn(),
  doc: jest.fn((ref, ...segments) => ({
    path: [ref.path, ...segments].filter(Boolean).join("/"),
  })),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
}));
jest.mock("../../utils/toastFunc", () => ({ toastFunc: jest.fn() }));
jest.mock("../atoms/QuestionTooltip", () => ({ QuestionTooltip: () => null }));
jest.mock("../organisms/SkeletonComponent", () => ({
  SkeletonComponent: () => <p role="status">TOPを読み込み中</p>,
}));

const mockGetDocs = getDocs as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockSetDoc = setDoc as jest.Mock;
const date = Timestamp.fromDate(new Date(2026, 9, 24));
const user = { uid: "signed-in-user", email: "user@example.com", displayName: "テスト" };
let settings: Array<{ id: string; contactManageType: number }>;

const snapshot = (docs: Array<{ id: string; data: () => unknown }>) => ({
  docs, size: docs.length, empty: docs.length === 0,
  forEach: (fn: (doc: unknown) => void) => docs.forEach(fn),
});

function renderApp(path = "/") {
  const client = new QueryClient({
    defaultOptions: { queries: { cacheTime: Infinity } },
  });
  const view = render(
    <StrictMode>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<RouteAuthGuard component={<Home />} redirect="/" />} />
            <Route path="/settings" element={<RouteAuthGuard component={<Settings />} redirect="/" />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </StrictMode>
  );
  return { ...view, client };
}

beforeEach(() => {
  jest.clearAllMocks();
  (collection as jest.Mock).mockImplementation((_db, ...segments) => ({
    path: segments.join("/"), withConverter() { return this; },
  }));
  (query as jest.Mock).mockImplementation((ref) => ref);
  (doc as jest.Mock).mockImplementation((ref, ...segments) => ({
    path: [ref.path, ...segments].filter(Boolean).join("/"),
  }));
  (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
    let active = true;
    Promise.resolve().then(() => { if (active) callback(_auth.currentUser); });
    return () => { active = false; };
  });
  (auth as unknown as { currentUser: unknown }).currentUser = user;
  settings = [];
  mockGetDocs.mockImplementation(async (ref) => {
    if (ref.path === "settings") {
      return snapshot(settings.map((setting) => ({
        id: setting.id,
        data: () => ({ uid: user.uid, contactManageType: setting.contactManageType }),
      })));
    }
    if (ref.path === "users") {
      return snapshot([{ id: "user-doc", data: () => ({
        uid: user.uid, user_name: "テスト", created_at: date, email: user.email,
      }) }]);
    }
    return snapshot([{ id: "stock-doc", data: () => ({
      id: "stock-doc", exchangeDay: date, exchangeDayLeft: date, exchangeDayRight: date,
      deadLine: date, updated_at: date, left_eye: 2, right_eye: 3,
    }) }]);
  });
  mockSetDoc.mockImplementation(async (_ref, data) => {
    settings = [{ id: "new-setting", contactManageType: data.contactManageType }];
    return { id: "new-setting" };
  });
  mockUpdateDoc.mockImplementation(async (_ref, data) => {
    settings = settings.map((s) => ({ ...s, contactManageType: data.contactManageType }));
  });
});

test("セッション復元後、URLからTOPを表示できる（StrictMode）", async () => {
  (auth as unknown as { currentUser: unknown }).currentUser = null;
  (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      _auth.currentUser = user;
      callback(user);
    });
    return () => { active = false; };
  });
  renderApp();
  expect(await screen.findByText("交換日")).toBeInTheDocument();
  expect(screen.queryByText("TOPを読み込み中")).not.toBeInTheDocument();
});

test("設定未作成でもONを保存し、TOPに戻って左右の交換日を表示する", async () => {
  renderApp();
  fireEvent.click(await screen.findByRole("button", { name: "設定" }));
  const toggle = await screen.findByLabelText("コンタクト交換日を左右それぞれ設定する");
  await waitFor(() => expect(toggle).toBeEnabled());
  fireEvent.click(toggle);
  await waitFor(() => expect(mockSetDoc).toHaveBeenCalledWith(
    { path: "settings/" + user.uid }, { uid: user.uid, contactManageType: 1 }, { merge: true }
  ));
  await waitFor(() => expect(screen.getByRole("button", { name: "戻る" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "戻る" }));
  await screen.findByText("交換日");
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
  expect(where).toHaveBeenCalledWith("uid", "==", user.uid);
});

test("保存済みのONを読み込み、OFFへの変更もTOPに反映する", async () => {
  settings = [{ id: "legacy-id", contactManageType: 1 }];
  renderApp("/settings");
  const toggle = await screen.findByLabelText("コンタクト交換日を左右それぞれ設定する");
  await waitFor(() => expect(toggle).toBeEnabled());
  expect(toggle).toBeChecked();
  fireEvent.click(toggle);
  await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalledWith(
    { path: "settings/legacy-id" }, { contactManageType: 0 }
  ));
  await waitFor(() => expect(screen.getByRole("button", { name: "戻る" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "戻る" }));
  await screen.findByText("交換日");
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(1);
});

test("保存中でもTOPに即座に戻れ、未保存の変更が古い設定で上書きされない", async () => {
  settings = [{ id: "legacy-id", contactManageType: 0 }];
  let completeSave!: () => void;
  mockUpdateDoc.mockImplementation(() => new Promise<void>((resolve) => {
    completeSave = resolve;
  }));
  const { client } = renderApp("/home");
  await screen.findByText("交換日");
  let completeStaleRead!: (value: unknown) => void;
  const normalGetDocs = mockGetDocs.getMockImplementation()!;
  mockGetDocs.mockImplementation((ref) => ref.path === "settings"
    ? new Promise((resolve) => { completeStaleRead = resolve; })
    : normalGetDocs(ref));
  await act(async () => { void client.invalidateQueries(["contactSettings", user.uid]); });
  const readsBeforeSettings = mockGetDocs.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "設定" }));
  const toggle = screen.getByLabelText("コンタクト交換日を左右それぞれ設定する");
  expect(toggle).toBeEnabled();
  fireEvent.click(toggle);
  await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: "戻る" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "戻る" }));
  expect(screen.getByText("交換日")).toBeInTheDocument();
  expect(screen.queryByText("TOPを読み込み中")).not.toBeInTheDocument();
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
  expect(mockGetDocs.mock.calls.length).toBe(readsBeforeSettings);
  await act(async () => {
    completeStaleRead(snapshot([{ id: "legacy-id", data: () => ({ contactManageType: 0 }) }]));
  });
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
  await act(async () => { completeSave(); });
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
});

test("保存に失敗したらトグルを元に戻し、再操作できる", async () => {
  const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
  mockSetDoc.mockRejectedValueOnce(new Error("permission denied"));
  renderApp("/settings");
  const toggle = await screen.findByLabelText("コンタクト交換日を左右それぞれ設定する");
  await waitFor(() => expect(toggle).toBeEnabled());
  fireEvent.click(toggle);
  await waitFor(() => expect(mockSetDoc).toHaveBeenCalled());
  await waitFor(() => expect(toggle).not.toBeChecked());
  await waitFor(() => expect(toggle).toBeEnabled());
  errorLog.mockRestore();
});

test("TOPへ戻った後に保存が失敗しても表示を元に戻し、エラーを通知する", async () => {
  const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
  settings = [{ id: "legacy-id", contactManageType: 0 }];
  let failSave!: (error: Error) => void;
  mockUpdateDoc.mockImplementation(() => new Promise((_resolve, reject) => { failSave = reject; }));
  try {
    renderApp("/home");
    await screen.findByText("交換日");
    fireEvent.click(screen.getByRole("button", { name: "設定" }));
    fireEvent.click(screen.getByLabelText("コンタクト交換日を左右それぞれ設定する"));
    await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "戻る" }));
    expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
    await act(async () => { failSave(new Error("permission denied")); });
    await waitFor(() => expect(document.querySelectorAll('input[type="date"]')).toHaveLength(1));
    expect(toastFunc).toHaveBeenCalledWith("error", expect.stringContaining("元の設定に戻しました"));
  } finally {
    errorLog.mockRestore();
  }
});

test("設定の取得が遅くてもTOPの在庫と操作ボタンを先に表示する", async () => {
  const normalGetDocs = mockGetDocs.getMockImplementation()!;
  let completeSettings!: (value: unknown) => void;
  mockGetDocs.mockImplementation((ref) => ref.path === "settings"
    ? new Promise((resolve) => { completeSettings = resolve; })
    : normalGetDocs(ref));
  renderApp("/home");
  expect(await screen.findByText("コンタクトレンズ残り")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "設定" })).toBeEnabled();
  expect(screen.queryByText("TOPを読み込み中")).not.toBeInTheDocument();
  await act(async () => {
    completeSettings(snapshot([{ id: "setting", data: () => ({ contactManageType: 1 }) }]));
  });
  await screen.findByText("交換日");
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(2);
});

test("TOPの読み込みが止まった場合はエラーと再試行を表示し、遅い応答は反映しない", async () => {
  jest.useFakeTimers();
  try {
    let completeRead!: (value: unknown) => void;
    const normalGetDocs = mockGetDocs.getMockImplementation()!;
    mockGetDocs.mockImplementation(() => new Promise((resolve) => { completeRead = resolve; }));
    renderApp("/home");
    await act(async () => {});
    expect(screen.getByText("TOPを読み込み中")).toBeInTheDocument();
    await act(async () => { jest.advanceTimersByTime(15000); });
    expect(screen.getByRole("alert")).toHaveTextContent("データを読み込めませんでした");
    await act(async () => { completeRead(snapshot([])); });
    mockGetDocs.mockImplementation(normalGetDocs);
    fireEvent.click(screen.getByRole("button", { name: "再読み込み" }));
    await act(async () => {});
    await screen.findByText("コンタクトレンズ残り");
    fireEvent.click(screen.getByRole("button", { name: "設定を再読み込み" }));
    await screen.findByText("交換日");
  } finally {
    jest.useRealTimers();
  }
});

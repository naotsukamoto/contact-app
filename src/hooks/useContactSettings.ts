import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useCallback, useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { db } from "../firebase";
import { toastFunc } from "../utils/toastFunc";
import { withTimeout } from "../utils/withTimeout";

type ContactSettings = {
  contactManageType: number;
  documentIds: string[];
};

export const useContactSettings = (uid: string) => {
  const queryClient = useQueryClient();
  const key = ["contactSettings", uid];
  const mutationKey = ["saveContactSettings", uid];
  const isSaving = useSyncExternalStore(
    useCallback((notify) => queryClient.getMutationCache().subscribe(notify), [queryClient]),
    useCallback(() => queryClient.isMutating({ mutationKey: ["saveContactSettings", uid] }) > 0, [queryClient, uid])
  );
  const settings = useQuery<ContactSettings>(key, async () => {
    const snapshot = await withTimeout(getDocs(
      query(collection(db, "settings"), where("uid", "==", uid))
    ));
    return {
      contactManageType: snapshot.docs[0]?.data().contactManageType === 1 ? 1 : 0,
      documentIds: snapshot.docs.map((setting) => setting.id),
    };
  }, {
    enabled: !!uid && !isSaving,
    staleTime: 60000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const save = useMutation<void, Error, number, ContactSettings | undefined>(
    async (contactManageType) => {
      const current = queryClient.getQueryData<ContactSettings>(key);
      const ids = current?.documentIds ?? [];
      if (ids.length === 0) {
        // UIDをIDにすることで、初回保存の再実行でも重複を作らない。
        await setDoc(doc(db, "settings", uid), { uid, contactManageType }, { merge: true });
      } else {
        await Promise.all(ids.map((id) =>
          updateDoc(doc(db, "settings", id), { contactManageType })
        ));
      }
    }, {
      mutationKey,
      onMutate: async (contactManageType) => {
        // 遅れて届く取得結果が変更直後の値を上書きしないようにする。
        await queryClient.cancelQueries(key);
        const previous = queryClient.getQueryData<ContactSettings>(key);
        queryClient.setQueryData<ContactSettings>(key, {
          documentIds: previous?.documentIds ?? [],
          contactManageType,
        });
        return previous;
      },
      onSuccess: () => {
        queryClient.setQueryData<ContactSettings | undefined>(key, (current) => current && ({
          ...current,
          documentIds: current.documentIds.length ? current.documentIds : [uid],
        }));
      },
      onError: (error, _value, previous) => {
        if (previous) queryClient.setQueryData(key, previous);
        console.error("設定の保存に失敗しました:", error);
        toastFunc("error", "設定の保存に失敗したため、元の設定に戻しました。もう一度お試しください");
      },
    }
  );

  return { ...settings, isSaving, save: save.mutate };
};

import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { database } from 'services/firebase';

export default function useFilestore(
  collectionName: string,
  sort?: {
    field?: string;
    type?: 'asc' | 'desc';
  },
  page?: number,
) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState(null);
  const unsubscribeRef = useRef(null);
  const collectionSplits = collectionName.split('/');
  const LIMIT_QUERY = 20;
  const collectionRef = collection(database, collectionName);

  // subscribe collection firebase
  const getAttendeeRoom = () => {
    setIsLoading(true);

    const filters = [];
    if (sort?.field && sort?.type) filters.push(orderBy(sort.field, sort.type));
    if (page) filters.push(limit(page * LIMIT_QUERY));

    const unsubscribe = onSnapshot(query(collectionRef, ...filters), documents => {
      const data = documents.docs.map(doc => {
        switch (collectionSplits[collectionSplits.length - 1]) {
          case 'rooms': {
            return {
              ...doc.data(),
              roomId: doc.id.toString(),
            };
          }
          case 'messages': {
            return {
              ...doc.data(),
              messageId: doc.id.toString(),
            };
          }
          case 'attendees': {
            return {
              ...doc.data(),
              attendeeUid: doc.id.toString(),
            };
          }
          default: {
            return {
              ...doc.data(),
              id: doc.id.toString(),
            };
          }
        }
      });

      setCollections(data);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setIsLoading(false);
    });

    unsubscribeRef.current = unsubscribe;
  };

  const nextPage = async () => {
    const q = query(collectionRef, orderBy(sort?.field, sort?.type), startAfter(lastVisible), limit(LIMIT_QUERY));
    const documents = await getDocs(q);
    setHasMore(documents.docs.length > 0);
  };

  useEffect(() => {
    if (lastVisible && sort) nextPage();
  }, [lastVisible]);

  useEffect(() => {
    getAttendeeRoom();
    // unscribe documents collection
    return () => {
      unsubscribeRef.current?.();
    };
  }, [collectionName, page]);

  return { collections, isLoading, hasMore };
}

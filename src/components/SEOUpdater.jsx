"use client";

import { useEffect } from "react";
// Removed getDoc and doc, as we need to query by slug instead of Document ID
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SEOUpdater({ pageId }) {
  useEffect(() => {
    const updateSEO = async () => {
      if (!pageId) return;

      try {
        let data = null;

        // 1. Check 'pages' collection by SLUG (Bug Fixed Here)
        const qPage = query(collection(db, "pages"), where("slug", "==", pageId));
        const queryPageSnapshot = await getDocs(qPage);
        
        if (!queryPageSnapshot.empty) {
          data = queryPageSnapshot.docs[0].data();
        } else {
          // 2. Check 'posts' collection by SLUG as fallback
          const qPost = query(collection(db, "posts"), where("slug", "==", pageId));
          const queryPostSnapshot = await getDocs(qPost);
          if (!queryPostSnapshot.empty) {
            data = queryPostSnapshot.docs[0].data();
          }
        }
        
        if (data) {
          // Update Title
          if (data.metaTitle) {
            document.title = data.metaTitle;
          }
          
          // Update Meta Description
          if (data.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = "description";
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.metaDescription;
          }
        }
      } catch (error) {
        console.error("Failed to load SEO data:", error);
      }
    };

    updateSEO();
  }, [pageId]);

  return null;
}
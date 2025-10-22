"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./not-found.module.css";
import Image from "next/image";
import React from "react";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = "fr";
  const homeHref = `/${locale}`;

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src="/not-found/404-illustration2.svg"
            alt="Page introuvable"
            width={300}
            height={200}
            priority
          />
        </div>
        <h1 className={styles.title}>Page non trouvée</h1>
        <p className={styles.subtitle}>
          Désolé, la page que vous recherchez n'existe pas.
        </p>

        <div className={styles.actions}>
          <Link
            href={homeHref}
            className={`text-white py-2 px-4 rounded bg-delivery-orange`}
          >
            Accueil
          </Link>

          <button
            type="button"
            className={`text-white py-2 px-4 rounded bg-delivery-orange`}
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>

        <p className={styles.path}>
          <span className={styles.pathLabel}>Chemin</span>{" "}
          <code className={styles.pathCode}>{pathname}</code>
        </p>
      </div>
    </main>
  );
}

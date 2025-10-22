"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  id?: string;
}

const OFFSET = 12;
const MEASURE_OFFSCREEN = -9999;

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  delay = 200,
  className = "",
  id,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const clearRaf = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const computeCoords = (tr: DOMRect, tipW: number, tipH: number) => {
    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = tr.top - tipH - OFFSET;
        left = tr.left + (tr.width - tipW) / 2;
        break;
      case "bottom":
        top = tr.bottom + OFFSET;
        left = tr.left + (tr.width - tipW) / 2;
        break;
      case "left":
        top = tr.top + (tr.height - tipH) / 2;
        left = tr.left - tipW - OFFSET;
        break;
      case "right":
      default:
        top = tr.top + (tr.height - tipH) / 2;
        left = tr.right + OFFSET;
        break;
    }

    const margin = 8;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    left = Math.min(
      Math.max(left, margin),
      Math.max(vw - tipW - margin, margin)
    );
    top = Math.min(Math.max(top, margin), Math.max(vh - tipH - margin, margin));

    return { top, left };
  };

  const measureTipSize = (text: string) => {
    const tmp = document.createElement("div");
    tmp.style.position = "fixed";
    tmp.style.top = `${MEASURE_OFFSCREEN}px`;
    tmp.style.left = `${MEASURE_OFFSCREEN}px`;
    tmp.style.visibility = "hidden";
    tmp.style.pointerEvents = "none";
    tmp.style.zIndex = "0";
    tmp.style.padding = "12px 16px";
    tmp.style.maxWidth = "280px";
    tmp.style.whiteSpace = "normal";
    tmp.style.fontSize = "14px";
    tmp.style.fontWeight = "500";
    tmp.style.lineHeight = "1.4";
    tmp.style.borderRadius = "16px";
    tmp.style.boxSizing = "border-box";
    tmp.style.fontFamily = "inherit";
    tmp.innerHTML = `
      <div style="margin-bottom:6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:rgba(226,232,240,0.85);">
        Note:
      </div>
      <div style="font-size:14px; line-height:1.4; color:#F1F5F9;">
        ${escapeHtml(text)}
      </div>
    `;
    document.body.appendChild(tmp);
    const rect = tmp.getBoundingClientRect();
    document.body.removeChild(tmp);
    return { width: rect.width, height: rect.height };
  };

  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const handleShow = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      clearRaf();
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          const trigger = triggerRef.current;
          if (!trigger) return;
          const tr = trigger.getBoundingClientRect();

          const { width: tipW, height: tipH } = measureTipSize(content);
          const { top, left } = computeCoords(tr, tipW, tipH);

          setCoords({ top, left });

          setVisible(true);

          rafRef.current = window.requestAnimationFrame(() => {
            if (!tooltipRef.current || !triggerRef.current) return;
            const tipRect = tooltipRef.current.getBoundingClientRect();
            const tr2 = triggerRef.current.getBoundingClientRect();
            const { top: top2, left: left2 } = computeCoords(
              tr2,
              tipRect.width,
              tipRect.height
            );
            const dx = Math.abs(left2 - (coords.left || 0));
            const dy = Math.abs(top2 - (coords.top || 0));
            if (dx > 1 || dy > 1) {
              setCoords({ top: top2, left: left2 });
            }
          });
        });
      });
    }, delay);
  };

  const handleHide = () => {
    clearTimer();
    clearRaf();
    setVisible(false);
    setCoords({ top: -9999, left: -9999 });
  };

  useEffect(() => {
    if (!visible) return;
    const onScrollOrResize = () => {
      const trigger = triggerRef.current;
      const tip = tooltipRef.current;
      if (!trigger || !tip) return;
      const tr = trigger.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const { top, left } = computeCoords(tr, tipRect.width, tipRect.height);
      setCoords({ top, left });
    };
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [visible, position, content]);

  useEffect(() => {
    return () => {
      clearTimer();
      clearRaf();
    };
  }, []);

  const tooltipElement = visible ? (
    <div
      ref={tooltipRef}
      role="tooltip"
      id={id}
      aria-hidden={!visible}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
        padding: "12px 16px",
        maxWidth: "280px",
        pointerEvents: "none",
        whiteSpace: "normal",
        background: "rgba(17,24,39,0.95)",
        color: "#F1F5F9",
        borderRadius: 16,
        border: "1px solid rgba(31,41,55,0.3)",
        transition: "opacity 160ms ease, transform 160ms ease",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(4px) scale(0.98)",
      }}
    >
      <div
        style={{
          marginBottom: 6,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "rgba(226,232,240,0.85)",
        }}
      >
        Note:
      </div>
      <div style={{ fontSize: 14, color: "#F1F5F9", lineHeight: 1.4 }}>
        {content}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      {typeof document !== "undefined" &&
        createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip;

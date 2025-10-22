"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ordersApi from "@/app/api/orders";
import {
  User,
  MapPin,
  Phone,
  Truck,
  Calendar,
  CreditCard,
  Package,
  Scale,
  FileText,
  Upload,
  Image,
} from "lucide-react";
import { OrdersUpdate } from "../../../../../types/types";
import { LoaderComponent } from "@/components/loader/Loader";

type OrderAny = Record<string, any>;

type Status =
  | "in_preparation"
  | "confirmed"
  | "deposited_at_hub"
  | "cancelled"
  | "dispatched"
  | "collected"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "returned_to_hub"
  | "paid";

const ALLOWED_STATUSES: Status[] = [
  "in_preparation",
  "confirmed",
  "deposited_at_hub",
  "cancelled",
  "dispatched",
  "collected",
  "out_for_delivery",
  "delivered",
  "returned",
  "returned_to_hub",
  "paid",
];

const STATUS_COLORS: Record<Status, string> = {
  in_preparation: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  deposited_at_hub: "bg-indigo-100 text-indigo-800",
  cancelled: "bg-red-100 text-red-800",
  dispatched: "bg-green-100 text-green-800",
  collected: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-emerald-100 text-emerald-800",
  returned: "bg-pink-100 text-pink-800",
  returned_to_hub: "bg-rose-100 text-rose-800",
  paid: "bg-teal-100 text-teal-800",
};

function normalizeStatus(v: any): Status | "" {
  if (typeof v !== "string") return "";
  return ALLOWED_STATUSES.includes(v as Status) ? (v as Status) : "";
}

function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    in_preparation: "En préparation",
    confirmed: "Confirmée",
    deposited_at_hub: "Déposée au hub",
    cancelled: "Annulée",
    dispatched: "Expédiée",
    collected: "Collectée",
    out_for_delivery: "En cours de livraison",
    delivered: "Livrée",
    returned: "Retour",
    returned_to_hub: "Retour au hub",
    paid: "Payée",
  };
  return labels[status] || status;
}

export default function OrderPageClient() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => {
    const raw = params?.id ?? "";
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  }, [params]);

  const [order, setOrder] = useState<OrderAny | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [deliverymanId, setDeliverymanId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const [tracking, setTracking] = useState<any[]>([]);
  const [trackingText, setTrackingText] = useState("");
  const [addingTracking, setAddingTracking] = useState(false);

  const [uploading, setUploading] = useState(false);

  const fmt = (v: any) =>
    v === null || v === undefined || v === "" ? "-" : String(v);
  const formatMoney = (v: any) => {
    if (v === null || v === undefined || v === "") return "-";
    const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n.toFixed(2) : String(v);
  };
  const formatDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const fetchOrder = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setError("ID invalide");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrderById(id);
      setOrder(data);
      setSelectedStatus(normalizeStatus(data?.status) || "");
      try {
        const t = await ordersApi.getOrderTracking(id);
        setTracking(Array.isArray(t) ? t : []);
      } catch {
        setTracking([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ?? "Erreur lors de la récupération de la commande."
      );
      setOrder(null);
      setSelectedStatus("");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleBack = () => router.back();

  const handleUpdateStatus = async () => {
    if (!order) return;
    if (!selectedStatus) {
      setError("Sélectionnez un statut valide.");
      return;
    }
    setStatusUpdating(true);
    try {
      const deliverymanIdNum =
        deliverymanId === "" ? undefined : Number(deliverymanId);
      const statusToSend: Status =
        normalizeStatus(selectedStatus) ||
        normalizeStatus(order?.status) ||
        "in_preparation";
      await ordersApi.bulkUpdateOrders([Number(order.id)], {
        status: statusToSend,
        ...(deliverymanIdNum !== undefined
          ? { deliverymanId: deliverymanIdNum }
          : {}),
      } as OrdersUpdate);
      setOrder({
        ...order,
        status: statusToSend,
        deliveryman: deliverymanIdNum
          ? { id: deliverymanIdNum }
          : order.deliveryman,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Impossible de mettre à jour le statut.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!order) return;
    const did = deliverymanId === "" ? null : Number(deliverymanId);
    setAssigning(true);
    try {
      await ordersApi.assignDeliveryman(order.id, did);
      setOrder({ ...order, deliveryman: did ? { id: did } : null });
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Erreur lors de l'assignation.");
    } finally {
      setAssigning(false);
    }
  };

  const handleAddTracking = async () => {
    if (!order || !trackingText.trim()) return;
    setAddingTracking(true);
    const statusForTracking: Status =
      normalizeStatus(selectedStatus) ||
      normalizeStatus(order?.status) ||
      "in_preparation";
    const payload = {
      orderId: order.id,
      status: statusForTracking,
      location: order.toCity?.name ?? order.fromCity?.name ?? "",
      note: trackingText,
      title: trackingText.slice(0, 255),
      description: trackingText,
    };
    try {
      const added = await ordersApi.addOrderTracking(order.id, payload as any);
      if (added) {
        setTracking((t) => [...t, added]);
      } else {
        const fresh = await ordersApi.getOrderTracking(order.id);
        setTracking(Array.isArray(fresh) ? fresh : []);
      }
      setTrackingText("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Impossible d'ajouter le suivi.");
    } finally {
      setAddingTracking(false);
    }
  };

  const handleUploadProof = async () => {
    if (!order) return;
    setUploading(true);
    try {
      await ordersApi.uploadDeliveryProof(order.id);
      await fetchOrder();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoaderComponent isLoading={loading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-[34px] h-[34px] rounded-xl bg-delivery-orange shadow-sm flex items-center justify-center transition-colors"
            aria-label="Retour"
          >
            <img
              src="/icons/arrow-left.svg"
              className="w-[14px]"
            />
          </button>
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">
              Commande{" "}
              {order?.orderId
                ? `#${order.orderId}`
                : Number.isFinite(id)
                ? `#${id}`
                : ""}
            </h1>
          </div>
        </header>

        {error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : !order ? (
          <div className="p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune commande trouvée.</p>
          </div>
        ) : (
          <main className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Client</h3>
                        <p className="text-sm text-gray-500">
                          Détails de contact
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        {fmt(order.firstname)} {fmt(order.lastName)}
                      </p>
                      <p className="text-gray-600">{fmt(order.address)}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${order.contactPhone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {fmt(order.contactPhone)}
                        </a>
                        {order.contactPhone2 && (
                          <>
                            <span className="text-gray-400">/</span>
                            <a
                              href={`tel:${order.contactPhone2}`}
                              className="text-blue-600 hover:underline"
                            >
                              {order.contactPhone2}
                            </a>
                          </>
                        )}
                      </div>
                      {order.note && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>Note: {order.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Villes</h3>
                        <p className="text-sm text-gray-500">
                          Origine & Destination
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">De:</span>{" "}
                        {order.fromCity?.name ?? "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">À:</span>{" "}
                        {order.toCity?.name ?? "-"}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Paiement
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {fmt(order.paymentType)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-right lg:text-left">
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Prix total
                        </h3>
                        <p className="text-sm text-gray-500">
                          Incl. frais et remise
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 text-lg font-semibold text-gray-900">
                      <div>{formatMoney(order.price)} €</div>
                      <div className="text-sm text-gray-600">
                        Frais: {formatMoney(order.shippingFee)} € | Remise:{" "}
                        {formatMoney(order.discount)} €
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Créée le</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-gray-500" />
                        Dimensions / Poids
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Poids: {fmt(order.weight)} kg</div>
                        <div>
                          H × L × P: {fmt(order.height)} × {fmt(order.length)} ×{" "}
                          {fmt(order.width)} cm
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {order.isStopDesk && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              Stop desk
                            </span>
                          )}
                          {order.freeShipping && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Livraison gratuite
                            </span>
                          )}
                          {order.hasExchange && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              Échange
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Dates importantes
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Payée: {formatDate(order.paidAt)}</div>
                        <div>Expédiée: {formatDate(order.shippedAt)}</div>
                        <div>Livrée: {formatDate(order.deliveredAt)}</div>
                        <div>Annulée: {formatDate(order.cancelledAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Articles ({order.orderItems?.length ?? 0})
                </h2>
                {Array.isArray(order.orderItems) &&
                order.orderItems.length > 0 ? (
                  <div className="space-y-3">
                    {order.orderItems.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {it.name ?? `Article ${idx + 1}`}
                          </h4>
                          {it.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {it.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {it.quantity ?? 1} ×{" "}
                            {formatMoney(it.unitPrice ?? it.price ?? "-")} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    Aucun article listé.
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Statut & Assignation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut actuel
                    </label>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        STATUS_COLORS[order.status as Status] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {getStatusLabel(order.status as Status)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau statut
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            setSelectedStatus(normalizeStatus(e.target.value))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">-- Choisir un statut --</option>
                          {ALLOWED_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {getStatusLabel(s)}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleUpdateStatus}
                          disabled={statusUpdating || !selectedStatus}
                          className="px-4 py-2 bg-delivery-orange text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                        >
                          {statusUpdating ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigner un livreur
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          value={deliverymanId}
                          onChange={(e) => setDeliverymanId(e.target.value)}
                          placeholder="ID du livreur (ex: 1)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleAssign}
                          disabled={assigning}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {assigning ? "Assignation..." : "Assigner"}
                        </button>
                        <div className="text-sm text-gray-500 min-w-0 truncate">
                          Actuel:{" "}
                          {order.deliveryman
                            ? order.deliveryman.name ??
                              `#${order.deliveryman.id ?? order.deliveryman}`
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Suivi de livraison
                </h2>
                {tracking.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    Aucun événement de suivi pour le moment.
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {tracking.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {t.title ?? t.message ?? "Événement"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(t.createdAt)}
                            </p>
                          </div>
                          {t.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {t.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    value={trackingText}
                    onChange={(e) => setTrackingText(e.target.value)}
                    placeholder="Ajouter un événement de suivi"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTracking}
                    disabled={addingTracking || !trackingText.trim()}
                    className="px-4 py-2 bg-delivery-orange  text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {addingTracking ? "Ajout..." : "Ajouter"}
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Preuves de livraison
                </h2>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={handleUploadProof}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading
                      ? "Traitement..."
                      : "Marquer preuve de livraison"}
                  </button>
                  {uploading && (
                    <p className="text-sm text-gray-500">
                      En cours de traitement...
                    </p>
                  )}
                </div>
                {Array.isArray(order.deliveryProofs) &&
                order.deliveryProofs.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.deliveryProofs.map((p: any, i: number) => (
                      <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                      >
                        <img
                          src={p.thumbnail ?? p.url}
                          alt={`Preuve de livraison ${i + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    Aucune preuve uploadée.
                  </div>
                )}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

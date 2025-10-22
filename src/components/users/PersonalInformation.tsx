"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/interface/button";
import { Input } from "@/components/interface/input";
import { Label } from "@/components/interface/label";
import { EyeOff, Eye } from "lucide-react";
import usersApi, { IUser } from "@/app/api/users";

function isoToDdMmYyyy(iso: string | null | undefined) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function isoToYyyyMmDdForInput(iso: string | null | undefined) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function ddMmYyyyToIsoForInput(ddmm: string | null | undefined) {
  if (!ddmm) return "";
  const m = ddmm.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  return `${m[3]}-${m[2]}-${m[1]}`; // yyyy-mm-dd
}

export default function PersonalInformation() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    dobDdMmYyyy: "", 
    dobIsoInput: "", 
    sex: "", 
    role: "",
    blocked: false,
    password: "",
    resetPassword: "",
    fullAddress: "",
    imgUrl: "",
  });

  useEffect(() => {
    let mounted = true;
    usersApi
      .getUserInfo()
      .then((u: IUser) => {
        if (!mounted || !u) return;
        const dobField = (u as any).dob ?? "";
        const dobDdmm = isoToDdMmYyyy(dobField);
        const dobIso = isoToYyyyMmDdForInput(dobField);
        setFormData((prev) => ({
          ...prev,
          nom: (u.nom as string) ?? "",
          prenom: (u.prenom as string) ?? "",
          fullName: (u.fullName as string) ?? "",
          phoneNumber: (u.phoneNumber as string) ?? "",
          email: (u.email as string) ?? "",
          dobDdMmYyyy: dobDdmm,
          dobIsoInput: dobIso,
          sex: (u.sex as string) ?? "",
          role: (u.role as string) ?? "",
          blocked: Boolean((u as any).blocked),
          fullAddress: (u as any).fullAddress ?? "",
          imgUrl: (u as any).imgUrl ?? (u as any).img ?? "",
        }));
        const img = (u as any).imgUrl ?? (u as any).img ?? "";
        if (img) setAvatarPreview(img);
      })
      .catch(() => {})
      .finally(() => {
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const openFilePicker = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      setError("Le fichier est trop volumineux (max 5MB).");
      return;
    }
    if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) {
      setError("Format invalide. JPG, PNG, WEBP ou GIF seulement.");
      return;
    }
    setError(null);
    setAvatarFile(f);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData((p) => ({ ...p, imgUrl: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDateChange = (isoDate: string) => {
    const parts = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!parts) {
      handleInputChange("dobIsoInput", "");
      handleInputChange("dobDdMmYyyy", "");
      return;
    }
    const ddmm = `${parts[3]}/${parts[2]}/${parts[1]}`;
    handleInputChange("dobIsoInput", isoDate);
    handleInputChange("dobDdMmYyyy", ddmm);
  };

  const handleValidate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const fd = new FormData();
      if (formData.nom) fd.append("nom", formData.nom);
      if (formData.prenom) fd.append("prenom", formData.prenom);
      if (formData.email) fd.append("email", formData.email);
      if (formData.phoneNumber) fd.append("phoneNumber", formData.phoneNumber);
      if (formData.fullAddress) fd.append("fullAddress", formData.fullAddress);
      if (formData.dobDdMmYyyy) fd.append("dob", formData.dobDdMmYyyy);
      if (formData.sex) {
        const val = String(formData.sex).toLowerCase();
        if (val === "homme" || val === "femme") fd.append("sex", val);
      }
      if (avatarFile) fd.append("img", avatarFile, avatarFile.name);
      if (!avatarFile && formData.imgUrl === "") {
        fd.append("img", "");
      }

      await usersApi.changeInfo(fd);

      const u = await usersApi.getUserInfo();
      if (u) {
        const dobField = (u as any).dob ?? "";
        handleInputChange("dobDdMmYyyy", isoToDdMmYyyy(dobField));
        handleInputChange("dobIsoInput", isoToYyyyMmDdForInput(dobField));
        handleInputChange("sex", (u as any).sex ?? "");
        handleInputChange("imgUrl", (u as any).imgUrl ?? (u as any).img ?? "");
        if ((u as any).imgUrl || (u as any).img)
          setAvatarPreview((u as any).imgUrl ?? (u as any).img ?? null);
      }

      setSuccess("Informations mises à jour");
      setAvatarFile(null);
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-delivery-bg rounded-lg">
      <h2 className="text-xl font-medium text-foreground mb-6">
        Mes informations
      </h2>

      <div className="bg-[#F1F1F1] rounded-xl p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-2 border-delivery-stroke">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No
                </div>
              )}
            </div>

            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-white border flex items-center justify-center text-sm"
                title="Retirer la photo"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={openFilePicker}
              className="bg-white border-delivery-stroke text-foreground rounded-lg px-4 py-2 h-auto text-sm"
            >
              Upload new photo
            </Button>

            <p className="text-delivery-gray text-xs">
              At least 800×800 px recommended.
              <br />
              JPG, PNG, WEBP or GIF accepted (max 5MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-xs">Prénom</Label>
            <Input
              value={formData.prenom}
              onChange={(e) => handleInputChange("prenom", e.target.value)}
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Nom</Label>
            <Input
              value={formData.nom}
              onChange={(e) => handleInputChange("nom", e.target.value)}
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Téléphone</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Date de naissance</Label>
            <Input
              type="date"
              value={formData.dobIsoInput}
              onChange={(e) => handleDateChange(e.target.value)}
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Sexe</Label>
            <select
              value={formData.sex ?? ""}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              className="w-full h-12 px-3 bg-white rounded-lg"
            >
              <option value="">--</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Rôle</Label>
            <Input
              value={formData.role}
              readOnly
              className="h-12 bg-white rounded-lg"
            />
          </div>

          <div>
            <Label className="text-xs">Compte bloqué</Label>
            <div className="h-12 flex items-center">
              <input
                type="checkbox"
                checked={Boolean(formData.blocked)}
                disabled
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Mot de passe</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-12 bg-white rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-xs">Reset mot de passe</Label>
            <div className="relative">
              <Input
                type={showResetPassword ? "text" : "password"}
                value={formData.resetPassword}
                onChange={(e) =>
                  handleInputChange("resetPassword", e.target.value)
                }
                className="h-12 bg-white rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowResetPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showResetPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-xs">Adresse complète</Label>
          <Input
            value={formData.fullAddress}
            onChange={(e) => handleInputChange("fullAddress", e.target.value)}
            className="h-12 bg-white rounded-lg"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(null);
              setError(null);
            }}
            className="bg-[#E1E1E1] text-black rounded-lg px-6 py-3 h-12"
          >
            Annuler
          </Button>
          <Button
            onClick={handleValidate}
            className="bg-delivery-orange text-white rounded-lg px-8 py-3 h-12"
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>

        <div className="mt-4 text-center">
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </div>
      </div>
    </div>
  );
}

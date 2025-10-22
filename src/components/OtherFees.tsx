// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { LoaderComponent } from "../loader/Loader";
// import settingsApi, {
//   Settings,
//   UpdateSettingsPayload,
// } from "@/app/api/settings";

// type OtherFee = {
//   id: keyof Settings;
//   number: string;
//   name: string;
//   value: number;
//   unit: string;
//   lastUpdate: string;
// };

// export default function OtherFeesComponent() {
//   const [otherFeeList, setOtherFeeList] = useState<OtherFee[]>([]);
//   const [settings, setSettings] = useState<Settings | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<keyof Settings | null>(null);
//   const [tempValue, setTempValue] = useState("");

//   useEffect(() => {
//     const fetchSettings = async () => {
//       setIsLoading(true);
//       setErrorMessage(null);
//       try {
//         const data = await settingsApi.getSettings();
//         setSettings(data);
//         const list: OtherFee[] = [
//           {
//             id: "freeWeightLimit",
//             number: "001",
//             name: "Free Weight Limit (kg)",
//             value: data.freeWeightLimit,
//             unit: "kg",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//           {
//             id: "weightPricePerKg",
//             number: "002",
//             name: "Weight Price per Kg",
//             value: data.weightPricePerKg,
//             unit: "da",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//           {
//             id: "maxWeightLimit",
//             number: "003",
//             name: "Max Weight Limit (kg)",
//             value: data.maxWeightLimit,
//             unit: "kg",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//           {
//             id: "freeVolumeLimit",
//             number: "004",
//             name: "Free Volume Limit (cm3)",
//             value: data.freeVolumeLimit,
//             unit: "cm3",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//           {
//             id: "volumePricePerCm3",
//             number: "005",
//             name: "Volume Price per Cm3",
//             value: data.volumePricePerCm3,
//             unit: "da",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//           {
//             id: "maxVolumeLimit",
//             number: "006",
//             name: "Max Volume Limit (cm3)",
//             value: data.maxVolumeLimit,
//             unit: "cm3",
//             lastUpdate: new Date(data.updatedAt).toLocaleDateString("en-GB"),
//           },
//         ];
//         setOtherFeeList(list);
//       } catch (err: any) {
//         const msg = err.body?.message || "Failed to load settings";
//         toast.error(msg);
//         setErrorMessage(msg);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const handleEdit = (item: OtherFee) => {
//     setEditingId(item.id);
//     setTempValue(item.value.toString());
//   };

//   const handleSave = async () => {
//     if (!settings || !tempValue || !editingId) return;
//     const valueNum = parseFloat(tempValue);
//     if (isNaN(valueNum) || valueNum < 0) {
//       toast.error("Invalid value");
//       return;
//     }
//     let updatedSettings: UpdateSettingsPayload = { ...settings };
//     (updatedSettings as any)[editingId] = valueNum;
//     try {
//       const newSettings = await settingsApi.updateSettings(updatedSettings);
//       setSettings(newSettings);
//       setOtherFeeList((prev) =>
//         prev.map((item) =>
//           item.id === editingId
//             ? {
//                 ...item,
//                 value: valueNum,
//                 lastUpdate: new Date(newSettings.updatedAt).toLocaleDateString(
//                   "en-GB"
//                 ),
//               }
//             : item
//         )
//       );
//       toast.success("Updated successfully");
//     } catch (err: any) {
//       toast.error(err.body?.message || "Failed to update");
//     } finally {
//       setEditingId(null);
//       setTempValue("");
//     }
//   };

//   return (
//     <div className="border border-[#D6D6D6] rounded-lg overflow-hidden bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-[#FDF4FF] border-b border-[#D6D6D6]">
//             <tr>
//               <th className="px-4 py-3 text-center text-xs font-normal text-black">
//                 Number
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-normal text-black">
//                 Name
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-normal text-black">
//                 Value
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-normal text-black">
//                 Last Update
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-normal text-black">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8">
//                   <div className="flex justify-center w-full items-center p-10">
//                     <LoaderComponent isLoading />
//                   </div>
//                 </td>
//               </tr>
//             ) : errorMessage ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8 text-red-500">
//                   Error: {errorMessage}
//                 </td>
//               </tr>
//             ) : otherFeeList.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8 text-gray-500">
//                   No other fees found.
//                 </td>
//               </tr>
//             ) : (
//               otherFeeList.map((item) => (
//                 <tr
//                   key={item.id}
//                   className="border-b border-[#D6D6D6] hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-4 py-4 text-center text-sm text-black font-medium">
//                     {item.number}
//                   </td>
//                   <td className="px-4 py-4 text-center text-sm text-black">
//                     {item.name}
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex justify-center">
//                       {editingId === item.id ? (
//                         <input
//                           type="number"
//                           value={tempValue}
//                           onChange={(e) => setTempValue(e.target.value)}
//                           className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm text-center w-20 focus:outline-none focus:ring-2 focus:ring-[#FF5A01] focus:border-transparent"
//                           min="0"
//                           step="0.01"
//                         />
//                       ) : item.value === 0 ? (
//                         <span className="px-3 py-1 rounded-md bg-[#DBEAFE] text-[#1E40AF] text-sm">
//                           --
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 rounded-md bg-[#DBEAFE] text-[#1E40AF] text-sm font-medium">
//                           {item.value} {item.unit}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 text-center text-sm text-gray-600">
//                     {item.lastUpdate}
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center justify-center">
//                       {editingId === item.id ? (
//                         <>
//                           <button
//                             onClick={handleSave}
//                             className="w-[26.22px] h-[26.22px] rounded-[7.44px] bg-green-500 flex items-center justify-center mx-1 hover:bg-green-600 transition-colors"
//                           >
//                             <span className="text-white text-xs font-medium">
//                               ✓
//                             </span>
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingId(null);
//                               setTempValue("");
//                             }}
//                             className="w-[26.22px] h-[26.22px] rounded-[7.44px] bg-gray-500 flex items-center justify-center mx-1 hover:bg-gray-600 transition-colors"
//                           >
//                             <span className="text-white text-xs font-medium">
//                               ✕
//                             </span>
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="w-[26.22px] h-[26.22px] rounded-[7.44px] bg-[#FED7AA] flex items-center justify-center hover:bg-[#FDBA74] transition-colors"
//                         >
//                           <img
//                             src="/icons/edit.svg"
//                             alt="Edit"
//                             className="w-4 h-4"
//                           />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

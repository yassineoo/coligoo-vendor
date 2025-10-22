// export default function Table({orders}) {
//   return (
//     <>
//       <table className="w-full min-w-[1000px]">
//         <thead>
//           <tr className="bg-[#FDF4FF] border-b border-[#D6D6D6]">
//             <th className="w-[40px] px-4 py-3 border-r border-[#EAECF0] bg-[#FCFCFD]">
//               <div className="flex items-center justify-center">
//                 <div
//                   className="relative w-[15px] h-[15px] rounded border border-[#FF5A01] bg-[#F7FAFF] flex items-center justify-center cursor-pointer"
//                   onClick={toggleAllSelection}
//                 >
//                   {isSomeSelected && (
//                     <svg
//                       width="10"
//                       height="10"
//                       viewBox="0 0 12 11"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="absolute"
//                     >
//                       <path
//                         d="M2.979 5.23486H9.03279"
//                         stroke="#FF5A01"
//                         strokeWidth="1.48256"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   )}
//                   {isAllSelected && (
//                     <svg
//                       width="10"
//                       height="10"
//                       viewBox="0 0 12 11"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="absolute"
//                     >
//                       <path
//                         d="M2.979 5.23486H9.03279"
//                         stroke="#FF5A01"
//                         strokeWidth="1.48256"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Date
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Tracking
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Client
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Contact
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Wilaya
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Adresse
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Order
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Total Price
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Delivery
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Procedure
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-normal text-black">
//               Condition
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((order) => (
//             <tr key={order.id} className="border-b border-[#D6D6D6]">
//               <td className="px-4 py-4 border-r border-[#EAECF0] bg-[#FCFCFD]">
//                 <div className="flex items-center justify-center">
//                   <div
//                     className="w-[15px] h-[15px] rounded border border-[#FF5A01] bg-white cursor-pointer"
//                     onClick={() => toggleOrderSelection(order.id)}
//                   >
//                     {selectedOrders.has(order.id) && (
//                       <svg
//                         width="15"
//                         height="15"
//                         viewBox="0 0 15 15"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M4 7.5L6.5 10L11 5"
//                           stroke="#FF5A01"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//               </td>
//               <td className="px-4 py-4 text-sm whitespace-nowrap text-black">
//                 {order.date
//                   ? (() => {
//                       const s = new Date(order.date).toLocaleDateString(
//                         "fr-FR",
//                         {
//                           day: "2-digit",
//                           month: "long",
//                           year: "numeric",
//                         }
//                       );
//                       return s.charAt(0).toUpperCase() + s.slice(1);
//                     })()
//                   : "—"}
//               </td>
//               <td className="px-4 py-4">
//                 <span className="inline-block whitespace-nowrap px-2 py-1 text-xs font-medium text-white bg-[#FF5A01] rounded">
//                   {order.tracking}
//                 </span>
//               </td>
//               <td className="px-4 py-4 text-sm text-black">{order.client}</td>
//               <td className="px-4 py-4 text-sm text-black">{order.contact}</td>
//               <td className="px-4 py-4 text-sm text-black">{order.wilya}</td>
//               <td className="px-4 py-4 text-sm text-black">{order.address}</td>
//               <td className="px-4 py-4 text-sm text-black">{order.order}</td>
//               <td className="px-4 py-4 text-sm text-black">
//                 {order.totalPrice}
//               </td>
//               <td className="px-4 py-4 text-sm text-black">{order.delivery}</td>
//               <td className="px-4 py-4 text-sm text-black">
//                 {order.procedure}
//               </td>
//               <td className="px-4 py-4">
//                 {order.condition === "delivered" ? (
//                   <span className="inline-block px-3 py-1 text-sm font-medium text-[#00B341] bg-[#D4F4DD] rounded">
//                     Livrée
//                   </span>
//                 ) : order.condition === "change" ? (
//                   <span className="inline-block px-3 py-1 text-sm font-medium text-[#FFB020] bg-[#FFF4E5] rounded">
//                     Changement
//                   </span>
//                 ) : (
//                   <span className="inline-block px-3 py-1 text-sm font-medium text-[#1E90FF] bg-[#D6ECFF] rounded">
//                     En préparation
//                   </span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// }

interface SidebarProps {
  aliases: string[];
  currentPage: number;
  totalPages: number;
}

export default function Sidebar({
  aliases,
  currentPage,
  totalPages,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Aliases
          </h2>
          <div className="text-xs text-gray-600">
            <p>Page {currentPage} of {totalPages}</p>
            <p className="mt-1">{aliases.length} aliases on this page</p>
          </div>
        </div>
        <ul className="space-y-1">
          {aliases.map((alias) => (
            <li key={alias}>
              <div className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                {alias}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// interface SidebarProps {
//   aliases: string[];
//   selectedAlias: string | null;
//   onAliasClick: (alias: string | null) => void;
// }

// export default function Sidebar({
//   aliases,
//   selectedAlias,
//   onAliasClick,
// }: SidebarProps) {
//   return (
//     <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
//       <div className="p-4">
//         <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
//           Aliases
//         </h2>
//         <ul className="space-y-1">
//           {aliases.map((alias) => (
//             <li key={alias}>
//               <button
//                 onClick={() => onAliasClick(alias)}
//                 className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
//                   selectedAlias === alias
//                     ? 'bg-blue-100 text-blue-700 font-medium'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 {alias}
//               </button>
//             </li>
//           ))}
//           <li className="pt-2 border-t border-gray-200 mt-2">
//             <button
//               onClick={() => onAliasClick(null)}
//               className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
//                 selectedAlias === null
//                   ? 'bg-blue-100 text-blue-700 font-medium'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               Images without aliases
//             </button>
//           </li>
//         </ul>
//       </div>
//     </aside>
//   );
// }
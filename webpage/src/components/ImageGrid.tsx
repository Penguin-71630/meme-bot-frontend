import type { Image, Alias } from '../types';
import { api } from '../api';

interface ImageGridProps {
  images: Image[];
  aliases: Alias[];
  onImageClick: (image: Image) => void;
}

export default function ImageGrid({ images, aliases, onImageClick }: ImageGridProps) {
  // Create a map of alias ID to alias name for current page aliases only
  const aliasMap = new Map(aliases.map(a => [a.id, a.name]));
  const currentPageAliasIds = new Set(aliases.map(a => a.id));
  
  // Group images by alias, but only for aliases on the current page
  const groupedImages = images.reduce((acc, image) => {
    if (image.aliasesIds.length === 0) {
      if (!acc['__no_alias__']) acc['__no_alias__'] = [];
      acc['__no_alias__'].push(image);
    } else {
      // Only process aliases that are on the current page
      image.aliasesIds.forEach((aliasId) => {
        if (currentPageAliasIds.has(aliasId)) {
          const aliasName = aliasMap.get(aliasId) || `Alias #${aliasId}`;
          if (!acc[aliasName]) acc[aliasName] = [];
          acc[aliasName].push(image);
        }
      });
    }
    return acc;
  }, {} as Record<string, Image[]>);

  // Maintain the same order as the aliases prop
  const filteredGroups = aliases
    .map(alias => [alias.name, groupedImages[alias.name]] as [string, Image[]])
    .filter(([_, imgs]) => imgs && imgs.length > 0);

  return (
    <div className="p-6 space-y-8">
      {filteredGroups.map(([alias, imgs]) => (
        <div key={alias}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {alias === '__no_alias__' ? 'Images without aliases' : `Alias: ${alias}`}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {imgs.map((image) => (
              <button
                key={image.id}
                onClick={() => onImageClick(image)}
                className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <img
                  src={api.getImageUrl(image.id, image.extension)}
                  alt={`Image ${image.id}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No images found
        </div>
      )}
    </div>
  );
}

// import type { Image } from '../types';

// interface ImageGridProps {
//   images: Image[];
//   onImageClick: (image: Image) => void;
// }

// export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
//   // Group images by alias
//   const groupedImages = images.reduce((acc, image) => {
//     if (image.aliases.length === 0) {
//       if (!acc['__no_alias__']) acc['__no_alias__'] = [];
//       acc['__no_alias__'].push(image);
//     } else {
//       image.aliases.forEach((alias) => {
//         if (!acc[alias]) acc[alias] = [];
//         acc[alias].push(image);
//       });
//     }
//     return acc;
//   }, {} as Record<string, Image[]>);

//   return (
//     <div className="p-6 space-y-8">
//       {Object.entries(groupedImages).map(([alias, imgs]) => (
//         <div key={alias}>
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             {alias === '__no_alias__' ? 'Images without aliases' : `Alias: ${alias}`}
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {imgs.map((image) => (
//               <button
//                 key={image.id}
//                 onClick={() => onImageClick(image)}
//                 className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
//               >
//                 <img
//                   src={`http://localhost:8080${image.url}`}
//                   alt={image.aliases.join(', ')}
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//       {Object.keys(groupedImages).length === 0 && (
//         <div className="text-center py-12 text-gray-500">
//           No images found
//         </div>
//       )}
//     </div>
//   );
// }
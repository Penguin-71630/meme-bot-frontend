import type { Image } from '../types';

interface ImageGridProps {
  images: Image[];
  aliases: string[];
  onImageClick: (image: Image) => void;
}

export default function ImageGrid({ images, aliases, onImageClick }: ImageGridProps) {
  // Group images by alias
  const groupedImages = images.reduce((acc, image) => {
    if (image.aliases.length === 0) {
      if (!acc['__no_alias__']) acc['__no_alias__'] = [];
      acc['__no_alias__'].push(image);
    } else {
      image.aliases.forEach((alias) => {
        if (!acc[alias]) acc[alias] = [];
        acc[alias].push(image);
      });
    }
    return acc;
  }, {} as Record<string, Image[]>);

  // Filter to only show aliases on current page
  const filteredGroups = Object.entries(groupedImages).filter(([alias]) =>
    aliases.includes(alias) || alias === '__no_alias__'
  );

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
                  src={`http://localhost:8080${image.url}`}
                  alt={image.aliases.join(', ')}
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
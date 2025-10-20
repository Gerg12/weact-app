import ProductImage from './ProductImage';

interface ProjectCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export default function ProjectCard({ 
  title = "Project Title", 
  description = "Project description goes here",
  imageUrl 
}: ProjectCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative mb-4 w-full h-48 rounded-md overflow-hidden">
          <ProductImage 
            src={imageUrl} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}


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
        <div className="mb-4">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}


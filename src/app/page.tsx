import ProjectCard from "./components/ProjectCard";

// 1. Create an array of your project data
const projectsData = [
  {
    title: "Sample Project 1",
    description: "This is a sample project card component.",
    imageUrl: "/path/to/image1.jpg", // Add your image paths here
  },
  {
    title: "Sample Project 2",
    description: "You can customize the content of each card.",
    imageUrl: "/path/to/image2.jpg",
  },
  {
    title: "Sample Project 3",
    description: "Cards can have images and more details.",
    imageUrl: "/path/to/image3.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2. Map over the array to render the components */}
        {projectsData.map((project) => (
          <ProjectCard
            key={project.title} // React needs a unique key for list items
            title={project.title}
            description={project.description}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
    </main>
  );
}
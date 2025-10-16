import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="w-full flex flex-col h-full px-20 py-2 gap-10">
      <div className="flex flex-col gap-4 w-full bg-black/20 py-4 px-40 rounded-3xl">
        <h1 className="text-4xl mx-auto font-bold text-black">Test buttons</h1>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="primary">Primary</Button>
      </div>
      <div className="flex flex-col gap-4 bg-black/20 py-4 px-40 rounded-3xl">
        <h1 className="text-4xl mx-auto font-bold text-black-400">
          Test colors
        </h1>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-blue-primary-50 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-100 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-500 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-600 rounded-lg h-18 w-10"></div>
          <div className="bg-blue-primary-700 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-red-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-red-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-red-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-red-primary-500 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-purple-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-purple-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-purple-primary-500 rounded-lg h-18 w-10"></div>
          <div className="bg-purple-primary-600 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-yellow-primary-50 rounded-lg h-18 w-10"></div>
          <div className="bg-yellow-primary-100 rounded-lg h-18 w-10"></div>
          <div className="bg-yellow-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-yellow-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-yellow-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-yellow-primary-500 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-green-primary-50 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-100 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-500 rounded-lg h-18 w-10"></div>
          <div className="bg-green-primary-600 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-neutral-dark-primary-50 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-100 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-500 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-600 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-700 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-800 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-dark-primary-900 rounded-lg h-18 w-10"></div>
        </div>
        <div className="flex flex-row gap-2 w-full h-full">
          <div className="bg-neutral-light-primary-50 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-light-primary-100 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-light-primary-200 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-light-primary-300 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-light-primary-400 rounded-lg h-18 w-10"></div>
          <div className="bg-neutral-light-primary-500 rounded-lg h-18 w-10"></div>
        </div>
      </div>
    </div>
  );
};

export default page;

import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex h-full w-full flex-col gap-10 px-20 py-2">
      <div className="flex w-full flex-col gap-4 rounded-3xl bg-black/20 px-40 py-4">
        <h1 className="mx-auto text-4xl font-bold text-black">Test buttons</h1>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="primary">Primary</Button>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl bg-black/20 px-40 py-4">
        <h1 className="text-black-400 mx-auto text-4xl font-bold">
          Test colors
        </h1>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-blue-primary-50 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-100 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-500 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-600 h-18 w-10 rounded-lg"></div>
          <div className="bg-blue-primary-700 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-red-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-red-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-red-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-red-primary-500 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-purple-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-purple-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-purple-primary-500 h-18 w-10 rounded-lg"></div>
          <div className="bg-purple-primary-600 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-yellow-primary-50 h-18 w-10 rounded-lg"></div>
          <div className="bg-yellow-primary-100 h-18 w-10 rounded-lg"></div>
          <div className="bg-yellow-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-yellow-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-yellow-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-yellow-primary-500 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-green-primary-50 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-100 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-500 h-18 w-10 rounded-lg"></div>
          <div className="bg-green-primary-600 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-neutral-dark-primary-50 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-100 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-500 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-600 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-700 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-800 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-dark-primary-900 h-18 w-10 rounded-lg"></div>
        </div>
        <div className="flex h-full w-full flex-row gap-2">
          <div className="bg-neutral-light-primary-50 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-light-primary-100 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-light-primary-200 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-light-primary-300 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-light-primary-400 h-18 w-10 rounded-lg"></div>
          <div className="bg-neutral-light-primary-500 h-18 w-10 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default page;

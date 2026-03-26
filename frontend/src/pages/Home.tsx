import F1 from "../assets/F1.svg";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center">
        <img src={F1}
        alt="F1 Logo Red"
        className="h-24 w-78 mb-8 mt-4" />
      </div>
      <hr className="w-full border-t-2 border-white" />
    </div>
  );
}
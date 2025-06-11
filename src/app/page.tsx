import GenerateLevels from "@/lib/GenerateLevels"
import Link from "next/link"
export default function page() {
  const jeu = GenerateLevels()
  
  return (
    <div className="pt-18 flex flex-col items-center gap-y-7">
      <h1 className="text-xl text-center font-bold underline">Memory Games</h1>
      <ul className="flex flex-col gap-y-3 p-2 w-[600px] px-10">
        {
          jeu.map(j=>{
            return(
              <li key={j.id} className=" items-center border py-3 px-2 rounded flex flex-row justify-between"><p>{j.difficulté}</p> <Link href={`/Jeu/${j.difficulté}`} className="mr-5 bg-gray-300 px-4 py-1 rounded">Start</Link></li>
            )
          })
        }
      </ul>
    </div>
  )
}
'use client'

import { Niveau } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";
import { useState,useEffect, useCallback } from "react";


type Propos={
    initiaLevel:Niveau|undefined
}

export default function Jeux({initiaLevel}:Propos) {
    const [cartes,setcartes]=useState<Niveau|undefined>(initiaLevel)//sauvegarde de la partie
    const[isload,setisload]=useState(false)//permet de verifier si la partie est bien load
    const[flippecarte,setflippecart]=useState<number[]>([]) //max 2
    const[start,setStart]=useState(false)
    const [nbpaire,setpaire]=useState(0)

    
// Fonction utilitaire pour obtenir la clé de sauvegarde
const getLevelKey = (difficulte:string) => {
    switch (difficulte) {
        case "Debutant": return "level1";
        case "Avance": return "level2";
        case "Expert": return "level3";
        default: return "level1";
    }
};

// Charger les données depuis localStorage****************
useEffect(() => {
    if (!initiaLevel) return;
    
    const levelKey = getLevelKey(initiaLevel.difficulté);
    const savedData = localStorage.getItem(levelKey);
    
    try {
        if (savedData) {
            const parsed = JSON.parse(savedData);
            
            // Vérification que les données correspondent au niveau actuel
            if (parsed?.difficulté === initiaLevel.difficulté && 
                parsed?.cards && 
                parsed?.flippecards && parsed.paires) {
                
                setcartes(parsed.cards);
                setflippecart(parsed.flippecards);
                setpaire(parsed.paires)
                setisload(true);
                return;
            } else {
                // Données incompatibles, on les supprime
                localStorage.removeItem(levelKey);
            }
        }
        
        // Initialisation avec les données par défaut
        setcartes(initiaLevel);
        setflippecart([]);
        setisload(true);
        
    } catch (error) {
        console.error(`Erreur lors du chargement de ${levelKey}:`, error);
        
        // Nettoyer les données corrompues
        localStorage.removeItem(levelKey);
        
        // Initialisation par défaut
        setcartes(initiaLevel);
        setflippecart([]);
        setisload(true);
    }
}, [initiaLevel]);

// Sauvegarder les données****************************
useEffect(() => {
    if (!isload || !cartes?.difficulté) return;
    
    const levelKey = getLevelKey(cartes.difficulté);
    
    const saveData = {
        difficulté: cartes.difficulté,
        cards: cartes,
        paires:nbpaire,
        flippecards: flippecarte || [],
        timestamp: Date.now() // Ajout d'un timestamp pour le debug
    };
    
    try {
        localStorage.setItem(levelKey, JSON.stringify(saveData));
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde de ${levelKey}:`, error);
        // Optionnel : notifier l'utilisateur que la sauvegarde a échoué
    }
}, [cartes, flippecarte, isload]);

// Fonction utilitaire pour effacer une sauvegarde spécifique
const clearLevelData = useCallback(() => {
    if (!cartes?.difficulté) return false;
    
    const levelKey = getLevelKey(cartes.difficulté);
    if (levelKey) {
        localStorage.removeItem(levelKey);
        setcartes(initiaLevel); // Réinitialise immédiatement après suppression
        setflippecart([]);
        setpaire(0)
        return true;
    }
    return false;
}, [cartes, initiaLevel]);

useEffect(() => {
    if (!cartes) return;

    let timeoutId: NodeJS.Timeout;

    if (cartes.partie.moves === 0 ) { // Réinitialisation uniquement si nécessaire
        timeoutId = setTimeout(() => {
            clearLevelData();
        }, 5000);
    }

    return () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}, [cartes, flippecarte, clearLevelData]);


    
//fonction pour retourné une carte
const turn=useCallback((id:number)=>{
    
    if((!cartes||flippecarte.includes(id)||flippecarte.length>=2)&&continus(cartes?.partie.score as number)) return;

   setcartes(prev=>{
    if(!prev)return prev
    return{
        ...prev,
        partie:{
            ...prev.partie,
            cartes:prev?.partie?.cartes.map(c=>c.id===id && !c.visible ?{...c,visible:true}:c)
        }

    }
   })
   setflippecart([...flippecarte,id])
},[cartes,flippecarte])
//trouver les paire
    useEffect(()=>{
        if(flippecarte.length!=2||!cartes)return;
        const [id1,id2] = flippecarte
        const c1 =cartes.partie.cartes.find(c=>c.id===id1)
        const c2 = cartes.partie.cartes.find(c=>c.id===id2)
        if(!c1||!c2) return;
        let timeoutid :NodeJS.Timeout

        if(c1.img===c2.img){
           timeoutid= setTimeout(()=>{
                setcartes(prev=>{
                if(!prev)return prev
                return{
                    ...prev,
                    partie:{
                        ...prev.partie,
                        score:prev.partie.score+1,
                        moves:prev.partie.moves+1
                    }
                }
            },
            )
           setflippecart([])
           setpaire(prev=>prev+1)
            },500)
        }else{
            timeoutid=setTimeout(()=>{
                setcartes(prev=>{
                if(!prev)return prev
                return{
                    ...prev,
                    partie:{
                        ...prev.partie,
                        cartes:prev.partie.cartes.map(c=>c.id===id1||c.id===id2?{...c,visible:false}:c),
                        moves:prev.partie.moves+1
                    }
                }
            },
            )
            setflippecart([])
            },1000)

        }
    return ()=>{
        if(timeoutid){
            clearTimeout(timeoutid)
        }
    }
    },[flippecarte,cartes])
    
{/******************************************************************************************* */}
//controller le nombre de moves 
     const continus= useCallback((moves:number)=>{
        if(!cartes) return false
        return moves<=cartes.moves
    },[cartes])

    useEffect(()=>{
        if(!cartes) return

        const currentemoves = cartes.partie.moves
        const isgame = continus(currentemoves)

        if(isgame)return

        let timeoutid :NodeJS.Timeout

        timeoutid = setTimeout(()=>{
            setcartes(prev=>{
                if(!prev)return prev
                return{
                    ...prev,
                    partie:{
                        ...prev.partie,
                        score:0,
                        moves:0,
                        cartes:prev.partie.cartes.map(c=>({...c,visible:false}))
                    }
                }
            })
            setflippecart([])
            setpaire(0)
        },2000)
        return ()=>{
            if(timeoutid){
                clearTimeout(timeoutid)
            }
        }
    },[cartes,continus,])
const Win = ()=>{
    if(nbpaire===12 && cartes?.moves !== cartes?.partie.moves)return true
}
const Lose = ()=>{
    if(nbpaire!==12 && cartes?.moves === cartes?.partie.moves)return true
}

    return(

      <div> 
        
        <Link href='/' className="absolute top-4 left-5 "><button  className=" bg-red-500 text-white px-3 py-0.5 rounded cursor-pointer">exit</button></Link>
        <div className="flex flex-col items-center">
            <h1 className="text-xl pt-4 underline">Niveau {cartes?.difficulté}</h1>
            <ul className="flex flex-row  gap-x-10 justify-around p-1 rounded border border-black/20 min-w-xs mt-10">
                <li>moves: {cartes?.partie.moves}</li>
                <li>score: {cartes?.partie.score}</li>
                <li className="cursor-pointer bg-green-600 text-gray-100 px-3 py-1 rounded-md" onClick={()=>setStart(!start)}>{!start?"Start":"Stop"}</li>
                <li className="cursor-pointer bg-green-600 text-gray-100 px-3 py-1 rounded-md" onClick={()=>(clearLevelData())}>reset</li>
            </ul>
           { /*Table de jeu */}
           <ul className="grid grid-cols-6 grid-rows-4 gap-1 border-4 border-black/60 p-1 rounded-xl mt-10 relative ">
           {Win() && <div className="absolute inset-0 bg-white/80 z-50 flex justify-center items-center text-2xl"> <p>🎉Vous avez gagné!</p></div>}
           {Lose()&&<div className="absolute inset-0 bg-white/80 z-50 flex justify-center items-center text-2xl"> <p>😞Vous avez perdu!</p></div>}
                {
                    cartes?.partie.cartes.map((c)=>{
                        return(
                            <li key={c.id} className="relative h-28 w-[100px] border rounded bg-gray-300 cursor-pointer " onClick={()=>(!c.visible&&(start&&turn(c.id)))} >
                                <Image 
                                src={`/asset/${c.img}`}
                                alt={`image${c.id}`}
                                quality={100}
                                fill
                                className={`rounded ${c.visible? "":"hidden"}`}
                            />
                            </li>
                        )
                    })
                }
           </ul>
       </div>
       </div>
    )
  
}
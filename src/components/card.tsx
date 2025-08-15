import React from 'react'
import { SpotlightCard } from "@/components/ui/spotlightcard";

function Card() {
  return (
    <SpotlightCard className="w-80 h-72" spotlightColor="34, 211, 238">
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold mb-1">Spotlight Card</h3>
        <p className="text-sm text-muted-foreground">
          Hover to see the spotlight effect.
        </p>
      </div>
    </SpotlightCard>
  )
}

export default Card

import React from 'react'
import {SpotlightCard} from "@/components/ui/spotlightcard";

function Card() {
    return (
        <SpotlightCard className="w-80 h-96 bg-white/70" spotlightColor="34, 211, 238">
            <div className="w-full h-full flex flex-col items-center justify-start text-center p-4">
                <img
                    src="/snack1.png"
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg text-black font-semibold mb-1">Product</h3>
                <p className="text-sm text-gray-600 mb-3">
                    هذا وصف قصير للمنتج يوضح الميزات الأساسية بطريقة بسيطة.
                </p>
                <span className="text-2xl font-bold  text-black ">120 MAD</span>
            </div>
        </SpotlightCard>
    )
}

export default Card

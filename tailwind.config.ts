module.exports = { 
      content: [
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/dist/flowbite.min.js"
  ],
   theme: { 
     extend: { 
       keyframes: { 
                 "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        }, 
      }, 
      animation: { 
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "slide-out-left": "slide-out-left 0.3s ease-in", 
       }, 
     }, 
    }, 
    plugins: [
      require('flowbite/plugin'),
      function ({ addBase }: any) {
      addBase({
        ".toast-base": {
          "touch-action": "none",
          "user-select": "none",
          "-webkit-user-select": "none",
        },
      });
    },
    ], 
 };
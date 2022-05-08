import { defineConfig, transform } from "windicss/helpers";

module.exports = defineConfig({
    extract: {
        include: [
            "./pages/**/*.{js,ts,jsx,tsx}",
            "./components/**/*.{js,ts,jsx,tsx}",
            "./lib/**/*.{js,ts,jsx,tsx}",
        ],
        exclude: ["node_modules", ".git", ".next/**/*"],
    },
    shortcuts: {
        input: "h-10 w-full appearance-none placeholder-slate-500 bg-slate-700 border transition-colors border-slate-600 px-2 caret-sky-300 text-sky-300 focus-visible:border-sky-500 rounded focus-visible:outline-none",
        btn: "py-2 px-4 rounded bg-sky-500 h-10 mt-auto text-white hover:bg-sky-600 transition-all transform active:scale-95 duration-75 ease-in-out outline-hidden focus-visible:(outline-solid-sky-500 outline)",
        "btn-outline":
            "py-2 px-4 border border-sky-500 rounded h-10 mt-auto text-sky-500 hover:(text-white bg-sky-500) transition-all transform active:scale-95 duration-75 ease-in-out outline-hidden focus-visible:(outline-solid-sky-500 outline)",
        checkBox:
            "h-6 w-6 cursor-pointer mt-2 appearance-none border bg-slate-700 border-slate-600 rounded text-sky-500 focus:( outline-sky-500 ring-sky-300 ring-offset-0) checked:(bg-sky-500 hover:bg-sky-600)",
    },
    plugins: [require("windicss/plugin/forms"), transform("daisyui")],
});

import { Switch } from "@headlessui/react";
import { useThemeContext } from "../../store/themeContext";
import { useState } from 'react'
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggleSwitch() {

    const { theme, toggleTheme } = useThemeContext()
    const [enabled, setEnabled] = useState(theme === 'dark' ? true : false)

    const handleSwitchChange = (value) => {
        setEnabled(value)
        toggleTheme(value ? 'dark' : 'light')
    }

    return(
        <Switch
            checked={enabled}
            onChange={handleSwitchChange}
            className={`${
                enabled ? 'bg-indigo-400' : 'bg-gray-200'
            } relative inline-flex h-8 w-11 items-center rounded-full shadow-inner`}
        >
            <span className="sr-only">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
            <span
                className={`${
                enabled ? 'translate-x-4 text-yellow-300' : '-translate-x-1 text-yellow-600'
                } inline-block h-8 w-8 text-xl bg-white dark:bg-gray-900 drop-shadow transform rounded-full transform transition ease-in-out duration-200 flex items-center justify-center`}
            >
                {!enabled && <FiSun />}
                {enabled && <FiMoon />}
            </span>
        </Switch>
    )
}
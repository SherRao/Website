export const keybinds = ["ctrl+shift+j", "ctrl+shift+i"];

//TODO: Make these snarky.
export const getResponseForOs = (os) => {
    switch(os) {
    case "windows":
        return "I'm a Windows user";

    case "macos":
        return "I'm a Mac user";

    case "linux":
        return "I'm a Linux user";

    case "android":
        return "I'm an Android user";

    case "ios":
        return "I'm an iOS user";

    default:
        return "I'm an undetermined user";
    }
};

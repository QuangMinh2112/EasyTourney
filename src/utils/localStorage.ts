export const setLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, String(data))
  } catch (error) {
    console.log(error)
  }
}

export const getLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.log(error)
    return null
  }
}
export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.log(error)
  }
}

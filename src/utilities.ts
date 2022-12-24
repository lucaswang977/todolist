// Reorder the position of one item in provided array
// arr = [1, 2, 3, 4, 5], from = 2, to = 4
// return = [1, 2, 4, 5, 3]
export function reorderArray<T>(arr: T[], from: number, to: number): T[] {
  const newArr = arr.filter((element, index) => index !== from);

  return [...newArr.slice(0, to), arr[from], ...newArr.slice(to)] as T[];
}

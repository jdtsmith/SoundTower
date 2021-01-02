export function range(start, end, length = end - start) {
  return Array.from({ length }, (_, i) => start + i)
}

export var noteScale =
  {
    bottomFreq:55,
    nOctaves:5,
    nNotes:12,
  }

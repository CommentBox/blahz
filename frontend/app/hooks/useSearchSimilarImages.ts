import { useMutation } from "@tanstack/react-query"

async function searchSimilarImages(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/search", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to search for similar images")
  }

  return response.json()
}

export function useSearchSimilarImages() {
  return useMutation({
    mutationFn: searchSimilarImages,
  })
}


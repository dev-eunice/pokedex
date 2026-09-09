export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiClient<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(
      'Something went wrong while contacting PokéAPI. Please check your connection and try again.',
      0,
    )
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? 'The requested Pokémon could not be found.'
        : 'Unable to load Pokémon data from PokéAPI.'

    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

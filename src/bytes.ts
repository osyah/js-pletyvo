const encoder = new TextEncoder
const decoder = new TextDecoder

export function BytesFromString(string: string) {
	return encoder.encode(string)
}

export function BytesToString(bytes: Uint8Array) {
	return decoder.decode(bytes)
}
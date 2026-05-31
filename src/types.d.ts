declare module 'companion-module-utils' {
	export const graphics: {
		bar: (options: unknown) => Buffer
		stackImage: (images: Buffer[]) => Buffer
	}
}

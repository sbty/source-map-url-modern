interface SourceMappingURL {
  getFrom(code: string): string | null
  existsIn(code: string): boolean
  removeFrom(code: string): string
  insertBefore(code: string, value: string): string
  regex: RegExp
}

declare const sourceMappingURL: SourceMappingURL

export = sourceMappingURL

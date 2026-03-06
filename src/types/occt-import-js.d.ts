declare module 'occt-import-js' {
  interface OcctMesh {
    attributes: {
      position: { array: number[] }
      normal?: { array: number[] }
    }
    index?: { array: number[] }
  }

  interface OcctResult {
    meshes: OcctMesh[]
  }

  interface OcctInstance {
    ReadStepFile(buffer: Uint8Array, params: null): OcctResult
  }

  export default function (): Promise<OcctInstance>
}

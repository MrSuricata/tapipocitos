import { toast } from 'sonner'

/**
 * Borrado con arrepentimiento (patrón Gmail): el ítem desaparece de la
 * lista al instante, pero el borrado real recién se manda al servidor
 * cuando el toast se cierra sin que hayan tocado "Deshacer".
 * Si la app se cierra antes, no se borra nada: a prueba de dedos.
 */
export function deleteWithUndo(opts: {
  label: string
  onRestore: () => void
  onConfirm: () => void | Promise<void>
}) {
  let undone = false
  const finalize = () => {
    if (!undone) void opts.onConfirm()
  }
  toast(opts.label, {
    action: {
      label: 'Deshacer',
      onClick: () => {
        undone = true
        opts.onRestore()
      },
    },
    duration: 5000,
    onAutoClose: finalize,
    onDismiss: finalize,
  })
}

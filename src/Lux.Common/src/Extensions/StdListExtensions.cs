/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.STD;

public static class StdListExtensions
{
    public unsafe ref struct StdListEnumerator<T> where T : unmanaged {
        private ulong currentIndex;
        private readonly StdList<T> items;
        private StdList<T>.Node* current;

        public StdListEnumerator(StdList<T> list) {
            items = list;
            currentIndex = 0;
            current = list.Head;
        }
        
        public bool MoveNext() {
            if (currentIndex < items.Size) {
                if (current is not null && current->Next is not null) {
                    current = current->Next;
                    currentIndex++;
                    return true;
                }
            }

            return false;
        }
        
        public readonly ref T Current => ref current->Value;
        public StdListEnumerator<T> GetEnumerator() => new(items);
    }
    
    public static StdListEnumerator<T> GetEnumerator<T>(this StdList<T> list) where T : unmanaged => new(list);
}

public class BubbleSort {
    /**
     * 冒泡排序方法
     * @param arr 待排序的数组
     */
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        // 外层循环控制排序轮数
        for (int i = 0; i < n - 1; i++) {
            // 内层循环进行相邻元素比较和交换
            for (int j = 0; j < n - 1 - i; j++) {
                // 如果当前元素大于下一个元素，则交换它们
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    /**
     * 打印数组的辅助方法
     * @param arr 要打印的数组
     */
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            // 打印当前元素，确保不会越界
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // 测试数组
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("排序前的数组：");
        printArray(arr);
        
        // 执行冒泡排序
        bubbleSort(arr);
        
        System.out.println("排序后的数组：");
        printArray(arr);
    }
} 
import java.util.Arrays;
import java.util.List;

//需求：写一个工具类计算数组平均值
public class ArrayUtils {



  
    public static double average(int[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        int sum = 0;
        for (int i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return (double) sum / array.length;
    }

    // 使用 Stream 重构
    public void arrayFor() {    
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        numbers.stream().filter(num -> num % 2 == 0).forEach(System.out::println);
    }


    // public static int add(int a, int b) {
    //     //代码添加注释
    //     //第一次
    //     System.out.println("第一次输出");
    //     //第二次
    //     System.out.println("第二次输出");
    //     //第三次
    //     System.out.println("第三次输出");
    //     //第四次
    //     System.out.println("第四次输出");
    //     return 0;
    // }
                        

     //给下面方法添加注释
    /**
     * 计算两个数的和
     */
    public static int add(int a, int b) {
        return 0;
    }

    /**
     * 计算两个数的差
     */
    public static int subtract(int a, int b) {
        return 0;
    }

    /**
     * 计算两个数的除法
     */
    public static int multiply(int a, int b) {
        return 0;
    }

    /**
     * 计算两个数的乘积
     */
    public static int divide(int a, int b) {
        return 0;
    }
}
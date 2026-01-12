---
title: string & string_view
description: Intro about the look-at Function.
published: 2026-01-12
pinned: false
tags:
  - cpp
  - string
draft: false
category: ComputerGraphics
created: 2025-12-23
---
虽然 C 风格的字符串字面量可以使用，但 C 风格的字符串变量的行为有些奇怪，难以使用（例如，无法使用赋值来将 C 风格的字符串变量赋值给新的值），而且是危险的（例如，如果您将一个更大的 C 风格的字符串复制到分配给较短 C 风格的字符串的空间中，将会导致未定义的行为）。在现代 C++中，最好避免使用 C 风格的字符串变量。

幸运的是，C++已经引入了两种额外的字符串类型，它们更容易且更安全地使用：`std::string` 和 `std::string_view`（C++17）。与之前介绍的类型不同，`std::string` 和 `std::string_view` 不是基本类型（它们是类类型，我们将在未来介绍它们）。然而，使用它们的基本方法很简单，足够有用，因此我们将在这里介绍它们。

## `std::string` 的介绍

在 C++中，与字符串和字符串对象进行操作的最简单方法是使用 `std::string` 类型，它存在于头文件 `<string>` 中。

我们可以像其他对象一样创建类型为 `std::string` 的对象：3

```cpp
#include <string> // allows use of std::string

int main()
{
    std::string name {}; // empty string

    return 0;
}
```

就像普通的变量一样，你可以像预期的那样初始化或赋值给 std:: string 对象：

```cpp
#include <string>

int main()
{
    std::string name { "Alex" }; // initialize name with string literal "Alex"
    name = "John";               // change name to "John"

    return 0;
}
```

请注意，字符串可以由数字字符组成：

```cpp
std::string myID{ "45" }; // "45" is not the same as integer 45!
```

在字符串形式中，数字被视为文本而不是数字，因此不能像数字一样进行操作（例如，你不能将其乘以数字）。C++不会自动将字符串转换为整数或浮点值，或者反之亦然（尽管我们将在未来介绍一些方法）。

## 使用 `std::cout` 输出字符串

使用 `std::cout` 可以按预期输出 `std::string` 对象。

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name { "Alex" };
    std::cout << "My name is: " << name << '\n';

    return 0;
}
```

这输出出来的是：
<pre>
My name is: Alex
</pre>

空字符串将不会打印任何内容：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string empty{ };
    std::cout << '[' << empty << ']';

    return 0;
}
```

这将输出:
<pre>
[]
</pre>

## `std::string` 可以处理不同长度的字符串

`std::string` 最令人称道的一项功能是能够存储不同长度的字符串：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name { "Alex" }; // initialize name with string literal "Alex"
    std::cout << name << '\n';

    name = "Jason";              // change name to a longer string
    std::cout << name << '\n';

    name = "Jay";                // change name to a shorter string
    std::cout << name << '\n';

    return 0;
}
```

这将输出:
<pre>
Alex
Json
Jay
</pre>
在上面的例子中，`name` 被初始化为字符串 `"Alex"`，它包含五个字符（四个显式字符和一个空字符）。然后我们将 `name` 设置为一个更大的字符串，然后是一个更小的字符串。`std::string` 处理这些没有问题！你甚至可以在 `std::string` 中存储非常长的字符串。

这就是 `std::string` 如此强大的原因之一。

## 使用 `std::cin` 的字符串输入

将 `std::string` 与 `std::cin` 结合使用可能会带来一些惊喜！请考虑以下示例：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::cout << "Enter your full name: ";
    std::string name{};
    std::cin >> name; // this won't work as expected since std::cin breaks on whitespace

    std::cout << "Enter your favorite color: ";
    std::string color{};
    std::cin >> color;

    std::cout << "Your name is " << name << " and your favorite color is " << color << '\n';

    return 0;
}
```

这是该程序样本运行的结果：
<pre>
Enter your full name: John Doe
Enter your favorite color: Your name is John and your favorite color is Doe
</pre>

嗯，这不对！发生了什么？事实证明，当使用 `operator>>` 从 `std::cin` 提取字符串时，`operator>>` 只返回它遇到的第一个空格之前的字符。其他字符仍然留在 `std::cin` 中，等待下一个提取。

因此，当我们使用 `operator>>` 将输入提取到变量 `name` 时，只提取了 `"John"`，而 `" Doe"` 留在 `std::cin` 中。当我们随后使用 `operator>>` 提取输入到变量 `color` 时，它提取了 `"Doe"`，而不是等待我们输入颜色。然后程序结束。

## 使用 `std::getline()` 输入文本

要将完整的一行输入读取到字符串中，最好使用 `std::getline()` 函数。`std::getline()` 需要两个参数：第一个是 `std::cin`，第二个是你的字符串变量。

以下是使用 `std::getline()` 的相同程序：

```cpp
#include <iostream>
#include <string> // For std::string and std::getline

int main()
{
    std::cout << "Enter your full name: ";
    std::string name{};
    std::getline(std::cin >> std::ws, name); // read a full line of text into name

    std::cout << "Enter your favorite color: ";
    std::string color{};
    std::getline(std::cin >> std::ws, color); // read a full line of text into color

    std::cout << "Your name is " << name << " and your favorite color is " << color << '\n';

    return 0;
}
```

现在我们的程序按预期工作:
<pre>
Enter your full name: John Doe
Enter your favorite color: blue
Your name is John Doe and your favorite color is blue
</pre>

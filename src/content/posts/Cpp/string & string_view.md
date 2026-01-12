---
title: string & string_view
description: Intro to the std::string and std::string_view
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
## `std::ws` 到底是什么？

C++支持输入操纵符，它们改变输入的接受方式。`std::ws` 输入操纵符告诉 `std::cin` 在提取之前忽略任何前导空白。前导空白是指在字符串开头出现的任何空白字符（空格、制表符、换行符）。

让我们探讨一下这为什么有用。考虑以下程序：
```cpp
#include <iostream>
#include <string>

int main()
{
    std::cout << "Pick 1 or 2: ";
    int choice{};
    std::cin >> choice;

    std::cout << "Now enter your name: ";
    std::string name{};
    std::getline(std::cin, name); // note: no std::ws here

    std::cout << "Hello, " << name << ", you picked " << choice << '\n';

    return 0;
}
```

这是该程序的一些输出：
<pre>
Pick 1 or 2: 2
Now enter your name: Hello, , you picked 2
</pre>
该程序首先会要求您输入 1 或 2，并等待您的输入。到目前为止一切正常。然后它会要求您输入您的名字。然而，它实际上并不会等待您输入名字！相反，它会打印“Hello”字符串，然后退出。

当你使用 `operator>>` 输入一个值时，`std::cin` 不仅捕获该值，还捕获你按下回车键时出现的换行符（`'\n'`）。因此，当我们输入 `2` 并按下回车时，`std::cin` 将字符串 `"2\n"` 作为输入捕获。然后，它将值 `2` 提取到变量 `choice` 中，留下换行符以备后用。接着，当 `std::getline()` 去提取文本到 `name` 时，它发现 `"\n"` 已经在 `std::cin` 中等待，并认为我们之前输入了一个空字符串！这绝对不是我们想要的结果。

我们可以修改上述程序，使用 `std::ws` 输入操控符，告诉 `std::getline()` 忽略任何前导空白字符：
```cpp
#include <iostream>
#include <string>

int main()
{
    std::cout << "Pick 1 or 2: ";
    int choice{};
    std::cin >> choice;

    std::cout << "Now enter your name: ";
    std::string name{};
    std::getline(std::cin >> std::ws, name); // note: added std::ws here

    std::cout << "Hello, " << name << ", you picked " << choice << '\n';

    return 0;
}
```

现在这个程序将按预期运行:
<pre>
Pick 1 or 2: 2
Now enter your name: Alex
Hello, Alex, you picked 2
</pre>

> [!BEST] `std::getLine()` 的最佳实践
> 如果使用 `std::getline()` 读取字符串，请使用 `std::cin >> std::ws` 输入操控符来忽略前导空白。这需要在每次调用 `std::getline()` 时进行，因为 `std::ws` 在调用之间不会被保留。



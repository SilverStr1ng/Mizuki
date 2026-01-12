---
title: string & string_view
description: Intro to the std::string and std::string_view
published: 2026-01-12
pinned: false
tags:
  - cpp
  - string
draft: false
category: C++
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

> [!SUCCESS] `std::getLine()` 的最佳实践
> 如果使用 `std::getline()` 读取字符串，请使用 `std::cin >> std::ws` 输入操控符来忽略前导空白。这需要在每次调用 `std::getline()` 时进行，因为 `std::ws` 在调用之间不会被保留。

## `std::string` 的长度

如果我们想知道一个 `std::string` 中有多少个字符，我们可以询问一个 `std::string` 对象它的长度。这样做的语法与您之前见过的不同，但相当简单：
```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name{ "Alex" };
    std::cout << name << " has " << name.length() << " characters\n";

    return 0;
}
```

这将输出：
<pre>
Alex has 4 characters
</pre>

虽然 `std::string` 要求以空字符结束（从 C++11 开始），但返回的 `std::string` 的长度不包括隐式的空字符。

请注意，我们不是通过 `length(name)` 来请求字符串长度，而是使用 `name.length()`。`length()` 函数并不是一个普通的独立函数——它是一种嵌套在 `std::string` 内部的特殊类型的函数，称为 _成员函数_ 。由于 `length()` 成员函数是在 `std::string` 内部声明的，因此在文档中有时会写作 `std::string::length()`。

还要注意，`std::string::length()` 返回一个无符号整数值（很可能是 `size_t` 类型）。如果你想将长度赋值给一个 `int` 变量，你应该使用 `static_cast` 来避免编译器关于有符号/无符号转换的警告：

```cpp
int length { static_cast<int>(name.length()) };
```

## 初始化一个 `std::string` 是昂贵的

每当初始化一个 `std::string` 时，都会创建一个用于初始化的字符串的副本。复制字符串是昂贵的，因此应注意尽量减少复制的次数。

> [!SUCCESS] 关于 `std::string` 的最佳实践
> 不要按值传递 `std::string`，因为这会产生昂贵的复制。

## 返回一个 `std::string`

当一个函数通过值返回给调用者时，返回值通常是从函数复制回调用者的。因此，你可能会认为不应该通过值返回 `std::string`，因为这样会返回一个昂贵的 `std::string` 副本。

然而，作为一个经验法则，当返回语句的表达式解析为以下任意情况时，返回一个 `std::string` 通过值是可以的：
- 类型为 `std::string` 的局部变量。
- 一个从另一个函数调用或运算符返回的值的 `std::string`。
- 一个作为返回语句一部分创建的 `std::string` 临时对象。

在大多数其他情况下，最好避免按值返回 `std::string`，因为这样会导致昂贵的复制。

> [!TIP] 如果要返回 C-Style string literal
> 如果返回一个 C 风格的字符串字面量，请改用 `std::string_view` 返回类型。

## `std::string` 的字面量

双引号字符串字面量（如“Hello, world!”）默认是 C 风格字符串（因此，具有一种奇怪的类型）。

我们可以通过在双引号字符串字面量后使用 `s` 后缀来创建类型为 `std::string` 的字符串字面量。`s` 必须是小写。
```cpp
#include <iostream>
#include <string> // for std::string

int main()
{
    using namespace std::string_literals; // easy access to the s suffix

    std::cout << "foo\n";   // no suffix is a C-style string literal
    std::cout << "goo\n"s;  // s suffix is a std::string literal

    return 0;
}
```

> [!NOTE] 关于 "s" 后缀
> “s” 后缀位于命名空间 `std::literals::string_literals` 。
> 访问字面量后缀的最简洁方法是使用指令 `using namespace std::literals`。然而，这会将 _所有_ 标准库字面量导入使用指令的作用域，这会引入一些你可能不会使用的内容。
> 我们推荐 `using namespace std::string_literals` ，它仅导入 `std::string` 的字面量。

## Constexpr strings

如果你尝试定义一个 `constexpr std::string`，你的编译器可能会生成一个错误：
```cpp
#include <iostream>
#include <string>

int main()
{
    using namespace std::string_literals;

    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```

这是因为 `constexpr std::string` 在 C++17 或更早版本中根本不被支持，并且在 C++20/23 中仅在非常有限的情况下有效。如果您需要 constexpr 字符串，请改用 `std::string_view`。

## `std:string_view` 介绍

考虑以下程序：
```cpp
#include <iostream>

int main()
{
    int x { 5 }; // x makes a copy of its initializer
    std::cout << x << '\n';

    return 0;
}
```

当执行 `x` 的定义时，初始化值 `5` 被复制到为变量 `int x` 分配的内存中。对于基本类型，初始化和复制变量是快速的。

现在考虑这个类似的程序：
```cpp
#include <iostream>
#include <string>

int main()
{
    std::string s{ "Hello, world!" }; // s makes a copy of its initializer
    std::cout << s << '\n';

    return 0;
}
```

当 `s` 被初始化时，C 风格字符串字面量 `"Hello, world!"` 被复制到为 `std::string s` 分配的内存中。与基本类型不同，初始化和复制 `std::string` 是慢的。

在上面的程序中，我们对 `s` 所做的只是将其值打印到控制台，然后 `s` 被销毁。我们基本上是复制了“Hello, world!”仅仅为了打印，然后销毁那份副本。这是低效的。

在这个例子中我们看到类似的情况：
```cpp
#include <iostream>
#include <string>

void printString(std::string str) // str makes a copy of its initializer
{
    std::cout << str << '\n';
}

int main()
{
    std::string s{ "Hello, world!" }; // s makes a copy of its initializer
    printString(s);

    return 0;
}
```

这个例子对 C 风格字符串“Hello, world!”进行了两次复制：一次是在 `main()` 中初始化 `s` 时，另一次是在 `printString()` 中初始化参数 `str` 时。仅仅为了打印一个字符串，这样的复制实在是太多了！

## std:: string_view

为了解决 `std::string` 初始化（或复制）成本高的问题，C++17 引入了 `std::string_view`（它位于 `<string_view>` 头文件中）。` std::string_view ` 提供对_现有_字符串（C 风格字符串、` std::string ` 或另一个 ` std::string_view `）的只读访问，而无需进行复制。 **只读**意味着我们可以访问和使用被查看的值，但不能修改它。

以下示例与之前的示例相同，只是我们将 `std::string` 替换为 `std::string_view`。
```cpp
#include <iostream>
#include <string_view> // C++17

// str provides read-only access to whatever argument is passed in
void printSV(std::string_view str) // now a std::string_view
{
    std::cout << str << '\n';
}

int main()
{
    std::string_view s{ "Hello, world!" }; // now a std::string_view
    printSV(s);

    return 0;
}
```
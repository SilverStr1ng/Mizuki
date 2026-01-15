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

### 使用 `std::cout` 输出字符串

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

空字符串将不会输出任何内容：

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

### `std::string` 可以处理不同长度的字符串

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

### 使用 `std::cin` 的字符串输入

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

### 使用 `std::getline()` 输入文本

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
### `std::ws` 到底是什么？

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
该程序首先会要求您输入 1 或 2，并等待您的输入。到目前为止一切正常。然后它会要求您输入您的名字。然而，它实际上并不会等待您输入名字！相反，它会输出“Hello”字符串，然后退出。

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

> [!SUCCESS] 最佳实践
> 如果使用 `std::getline()` 读取字符串，请使用 `std::cin >> std::ws` 输入操控符来忽略前导空白。这需要在每次调用 `std::getline()` 时进行，因为 `std::ws` 在调用之间不会被保留。

### `std::string` 的长度

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

### 初始化一个 `std::string` 是昂贵的

每当初始化一个 `std::string` 时，都会创建一个用于初始化的字符串的副本。复制字符串是昂贵的，因此应注意尽量减少复制的次数。

> [!SUCCESS] 最佳实践
> 不要按值传递 `std::string`，因为这会产生昂贵的复制。

### 返回一个 `std::string`

当一个函数通过值返回给调用者时，返回值通常是从函数复制回调用者的。因此，你可能会认为不应该通过值返回 `std::string`，因为这样会返回一个昂贵的 `std::string` 副本。

然而，作为一个经验法则，当返回语句的表达式解析为以下任意情况时，返回一个 `std::string` 通过值是可以的：
- 类型为 `std::string` 的局部变量。
- 一个从另一个函数调用或运算符返回的值的 `std::string`。
- 一个作为返回语句一部分创建的 `std::string` 临时对象。

在大多数其他情况下，最好避免按值返回 `std::string`，因为这样会导致昂贵的复制。

> [!TIP] 如果要返回 C-Style string literal
> 如果返回一个 C 风格的字符串字面量，请改用 `std::string_view` 返回类型。

### `std::string` 的字面量

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

### Constexpr strings

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

## `std::string_view`

### `std:string_view` 介绍

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

在上面的程序中，我们对 `s` 所做的只是将其值打印到控制台，然后 `s` 被销毁。我们基本上是复制了“Hello, world!”仅仅为了输出，然后销毁那份副本。这是低效的。

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

这个例子对 C 风格字符串“Hello, world!”进行了两次复制：一次是在 `main()` 中初始化 `s` 时，另一次是在 `printString()` 中初始化参数 `str` 时。仅仅为了输出一个字符串，这样的复制实在是太多了！

### std:: string_view ==C++17==

为了解决 `std::string` 初始化（或复制）成本高的问题，C++17 引入了 `std::string_view`（它位于 `<string_view>` 头文件中）。` std::string_view ` 提供对*现有*字符串（C 风格字符串、` std::string ` 或另一个 ` std::string_view `）的只读访问，而无需进行复制。 **只读**意味着我们可以访问和使用被查看的值，但不能修改它。

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

该程序产生的输出与之前的相同，但没有创建字符串“Hello, world!”的副本。

当我们用 C 风格字符串字面量 `"Hello, world!"` 初始化 `std::string_view s` 时，`s` 提供对“Hello, world!”的只读访问，而无需复制字符串。当我们将 `s` 传递给 `printSV()` 时，参数 `str` 是从 `s` 初始化的。这使我们能够通过 `str` 访问“Hello, world!” ，同样无需复制字符串。

> [!SUCCESS] 最佳实践
> 在需要只读字符串时，优先使用 `std::string_view` 而不是 `std::string`，特别是在函数参数中。

### `std::string_view` 可以用多种不同类型的字符串进行初始化。

`std::string_view` 的一个有趣之处在于它的灵活性。`std::string_view` 对象可以用 C 风格字符串、`std::string` 或另一个 `std::string_view` 进行初始化：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    std::string_view s1 { "Hello, world!" }; // initialize with C-style string literal
    std::cout << s1 << '\n';

    std::string s{ "Hello, world!" };
    std::string_view s2 { s };  // initialize with std::string
    std::cout << s2 << '\n';

    std::string_view s3 { s2 }; // initialize with std::string_view
    std::cout << s3 << '\n';

    return 0;
}
```

### `std::string_view` 参数将接受多种不同类型的字符串参数

C 风格字符串和 `std::string` 都会隐式转换为 `std::string_view`。因此，`std::string_view` 参数将接受 C 风格字符串、`std::string` 或 `std::string_view` 类型的参数：
```cpp
#include <iostream>
#include <string>
#include <string_view>

void printSV(std::string_view str)
{
    std::cout << str << '\n';
}

int main()
{
    printSV("Hello, world!"); // call with C-style string literal

    std::string s2{ "Hello, world!" };
    printSV(s2); // call with std::string

    std::string_view s3 { s2 };
    printSV(s3); // call with std::string_view

    return 0;
}
```

### `std::string_view` 不会隐式转换为 `std::string`

因为 `std::string` 会复制其初始化器（这很耗费资源），C++ 不允许将 `std::string_view` 隐式转换为 `std::string`。这样做是为了防止意外将 `std::string_view` 参数传递给 `std::string` 参数，从而不必要地进行昂贵的复制。

然而，如果这是我们所期望的，我们有两个选择：
1. 显式地使用 `std::string_view` 初始化器创建一个 `std::string`（这是允许的，因为这种情况很少会无意中发生）
2. 使用 `static_cast` 将现有的 `std::string_view` 转换为 `std::string`

以下示例展示了两种选项：
```cpp
#include <iostream>
#include <string>
#include <string_view>

void printString(std::string str)
{
	std::cout << str << '\n';
}

int main()
{
	std::string_view sv{ "Hello, world!" };

	// printString(sv);   // compile error: won't implicitly convert std::string_view to a std::string

	std::string s{ sv }; // okay: we can create std::string using std::string_view initializer
	printString(s);      // and call the function with the std::string

	printString(static_cast<std::string>(sv)); // okay: we can explicitly cast a std::string_view to a std::string

	return 0;
}
```

### 赋值会改变 `std::string_view` 所查看的内容

将一个新字符串赋值给 `std::string_view` 会使 `std::string_view` 查看新字符串。它不会以任何方式修改先前查看的字符串。

以下示例说明了这一点：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    std::string name { "Alex" };
    std::string_view sv { name }; // sv is now viewing name
    std::cout << sv << '\n'; // prints Alex

    sv = "John"; // sv is now viewing "John" (does not change name)
    std::cout << sv << '\n'; // prints John

    std::cout << name << '\n'; // prints Alex

    return 0;
}
```

在上述示例中，`sv = "John"` 使得 `sv` 现在查看字符串 `"John"`。它并不改变 `name` 持有的值（仍然是 `"Alex"`）。

### `std::string_view` 的字面量

双引号字符串字面量默认是 C 风格字符串字面量。我们可以通过在双引号字符串字面量后使用 `sv` 后缀来创建类型为 `std::string_view` 的字符串字面量。`sv` 必须是小写。
```cpp
#include <iostream>
#include <string>      // for std::string
#include <string_view> // for std::string_view

int main()
{
    using namespace std::string_literals;      // access the s suffix
    using namespace std::string_view_literals; // access the sv suffix

    std::cout << "foo\n";   // no suffix is a C-style string literal
    std::cout << "goo\n"s;  // s suffix is a std::string literal
    std::cout << "moo\n"sv; // sv suffix is a std::string_view literal

    return 0;
}
```

使用 C 风格字符串字面量初始化 `std::string_view` 对象是可以的（你不需要用 `std::string_view` 字面量来初始化它）。

也就是说，使用 `std::string_view` 字面量初始化 `std::string_view` 不会导致问题（因为这些字面量实际上是伪装的 C 风格字符串字面量）。

### constexpr `std::string_view`

与 `std::string` 不同，`std::string_view` 完全支持 constexpr：
```cpp
#include <iostream>
#include <string_view>

int main()
{
    constexpr std::string_view s{ "Hello, world!" }; // s is a string symbolic constant
    std::cout << s << '\n'; // s will be replaced with "Hello, world!" at compile-time

    return 0;
}
```

这使得 `constexpr std::string_view` 成为需要字符串符号常量时的首选。

### 视图类型

由于 `std::string_view` 是我们第一次接触视图类型，我们将花一些额外的时间进一步讨论它。我们将重点介绍如何安全地使用 `std::string_view`，并提供一些示例说明它如何被错误使用。最后，我们将总结一些关于何时使用 `std::string` 与 `std::string_view` 的指导原则。

### An introduction to owners and viewers

让我们暂时转到一个类比上。假设你决定要画一幅自行车的画。但你没有自行车！你该怎么办？

好吧，你可以去当地的自行车商店买一辆。你将拥有那辆自行车。这有一些好处：你现在有了一辆可以骑的自行车。你可以保证在你想要的时候这辆自行车总是可用的。你可以装饰它，或者移动它。这个选择也有一些缺点。自行车很贵。如果你买了一辆，你现在就要对它负责。你必须定期维护它。当你最终决定不再想要它时，你必须妥善处理它。

拥有权可能很昂贵。作为一个拥有者，你有责任获取、管理和妥善处理你所拥有的物品。

在你离开家的路上，你瞥了一眼窗外。你注意到你的邻居把他们的自行车停在你窗前的对面。你可以选择画一幅你窗外看到的邻居的自行车的画。这种选择有很多好处。你节省了去获取自己自行车的费用。你不需要维护它。你也不需要负责处理它。当你看完后，你可以关上窗帘，继续你的生活。这结束了你对这个对象的视野，但这个对象本身并没有受到影响。这个选择也有一些潜在的缺点。你不能画或定制邻居的自行车。而且当你在看这辆自行车时，你的邻居可能会决定改变自行车的外观，或者将其完全移出你的视线。你可能最终会看到一些意想不到的东西。

观看是便宜的。作为一个观众，你对你所观看的对象没有责任，但你也无法控制这些对象。

### `std::string` 是一个（唯一的）拥有者

你可能会想知道为什么 `std::string` 会对其初始化器进行昂贵的复制。当一个对象被实例化时，会为该对象分配内存，以存储它在整个生命周期中需要使用的任何数据。这块内存是为对象保留的，并且在对象存在的期间内保证存在。这是一个安全的空间。`std::string`（以及大多数其他对象）将它们所给的初始化值复制到这块内存中，以便它们可以拥有自己的独立值，以便后续访问和操作。一旦初始化值被复制，对象就不再依赖于初始化器。

这是一件好事，因为初始化完成后，初始化器通常是不能被信任的。如果你把初始化过程想象成一个初始化对象的函数调用，那么谁在传递初始化器呢？是调用者。当初始化完成时，控制权返回给调用者。在这一点上，初始化语句已经完成，通常会发生两种情况之一：
- 如果初始化器是一个临时值或对象，那么该临时值将立即被销毁。
- 如果初始化器是一个变量，调用者仍然可以访问该对象。调用者可以对该对象进行任何操作，包括修改或销毁它。

因为 `std::string` 会对初始化器进行自己的复制，所以它不必担心初始化完成后初始化器发生的事情。初始化器可以被销毁或修改，这不会影响 `std::string`。缺点是这种独立性带来了制作昂贵副本的成本。

在我们的类比中，`std::string` 是一个拥有者——它负责从初始化器获取字符串数据，管理对字符串数据的访问，并在 `std::string` 对象被销毁时正确处理字符串数据。

> [!NOTE] 关于所有者的见解
> 在编程中，当我们称一个对象为所有者时，通常意味着它是唯一的所有者（除非另有说明）。唯一所有权（也称为单一所有权）确保明确谁对该数据负责。

### 我们并不总是需要复制

让我们回顾一下这个例子：
```cpp
#include <iostream>
#include <string>

void printString(std::string str) // str makes a copy of its initializer
{
    std::cout << str << '\n';
}

int main()
{
    std::string s{ "Hello, world!" };
    printString(s);

    return 0;
}
```

当调用 `printString(s)` 时，`str` 会对 `s` 进行一次昂贵的复制。该函数输出复制的字符串，然后销毁它。

注意，`s` 已经持有我们想要输出的字符串。我们能否直接使用 `s` 持有的字符串，而不是进行复制？答案可能是 -- 我们需要评估三个标准：
- 在 `str` 仍在使用 `s` 的时候，`s` 会被销毁吗？不会，`str` 在函数结束时销毁，而 `s` 存在于调用者的作用域中，不能在函数返回之前被销毁。
- 在 `str` 仍在使用 `s` 的时候，`s` 会被修改吗？不会，`str` 在函数结束时销毁，而调用者在函数返回之前没有机会修改 `s`。
- `str` 是否以某种方式修改字符串，使得调用者不会预期？不会，函数根本不修改字符串。

由于这三个条件都为假，因此使用 `s` 所持有的字符串而不是进行复制是没有风险的。并且由于字符串复制的成本很高，为什么要为一个我们不需要的复制付费呢？

### `std::string_view` 是一个查看器

`std::string_view` 采用不同的初始化方法。它不是对初始化字符串进行昂贵的复制，而是创建一个对初始化字符串的廉价视图。然后可以在需要访问字符串时使用 `std::string_view`。

在我们的类比中，`std::string_view` 是一个查看器。它查看一个已经存在于其他地方的对象，并且无法修改该对象。当视图被销毁时，被查看的对象不受影响。多个查看器同时查看一个对象是可以的。

重要的是要注意，`std::string_view` 在其生命周期内依赖于初始化器。如果在视图仍在使用时，被查看的字符串被修改或销毁，将会导致意外或未定义的行为。

每当我们使用视图时，确保这些可能性不发生是我们的责任。

一个正在查看已被销毁字符串的 `std::string_view` 有时被称为<font color="#4dfe50">悬空</font>(**dangling**)视图。

### `std::string_view` 最好用作只读函数参数

`std::string_view` 的最佳用法是作为只读函数参数。这允许我们传入 C 风格字符串、`std::string` 或 `std::string_view` 参数，而无需进行复制，因为 `std::string_view` 将创建对参数的视图。
```cpp
#include <iostream>
#include <string>
#include <string_view>

void printSV(std::string_view str) // now a std::string_view, creates a view of the argument
{
    std::cout << str << '\n';
}

int main()
{
    printSV("Hello, world!"); // call with C-style string literal

    std::string s2{ "Hello, world!" };
    printSV(s2); // call with std::string

    std::string_view s3 { s2 };
    printSV(s3); // call with std::string_view

    return 0;
}
```

因为 `str` 函数参数在控制返回给调用者之前被创建、初始化、使用和销毁，所以没有风险会导致被查看的字符串（函数参数）在我们的 `str` 参数之前被修改或销毁。

### 不当使用 `std::string_view`

让我们来看几个错误使用 `std::string_view` 导致问题的案例。

这是我们的第一个例子：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    std::string_view sv{};

    { // create a nested block
        std::string s{ "Hello, world!" }; // create a std::string local to this nested block
        sv = s; // sv is now viewing s
    } // s is destroyed here, so sv is now viewing an invalid string

    std::cout << sv << '\n'; // undefined behavior

    return 0;
}
```

在这个例子中，我们在一个嵌套块中创建了 `std::string s`（暂时不用担心什么是嵌套块）。然后我们将 `sv` 设置为查看 `s`。`s` 在嵌套块结束时被销毁。`sv` 并不知道 `s` 已经被销毁。当我们使用 `sv` 时，我们正在访问一个无效的对象，从而导致未定义行为。

这是同一问题的另一个变体，我们用函数的 `std::string` 返回值初始化 `std::string_view`：
```cpp
#include <iostream>
#include <string>
#include <string_view>

std::string getName()
{
    std::string s { "Alex" };
    return s;
}

int main()
{
  std::string_view name { getName() }; // name initialized with return value of function
  std::cout << name << '\n'; // undefined behavior

  return 0;
}
```

这与之前的例子类似。`getName()` 函数返回一个包含字符串 “Alex” 的 `std::string`。返回值是临时对象，在包含函数调用的完整表达式结束时被销毁。我们必须立即使用这个返回值，或者将其复制以便后续使用。

但是 `std::string_view` 不会进行复制。相反，它创建了一个对临时返回值的视图，而该值随后被销毁。这使得我们的 `std::string_view` 变得悬空（查看一个无效对象），并且打印该视图会导致未定义行为。

以下是上述内容的一个不太明显的变体：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    using namespace std::string_literals;
    std::string_view name { "Alex"s }; // "Alex"s creates a temporary std::string
    std::cout << name << '\n'; // undefined behavior

    return 0;
}
```

一个 `std::string` 字面量（通过 `s` 字面量后缀创建）会创建一个临时的 `std::string` 对象。因此在这种情况下，`"Alex"s` 创建了一个临时的 `std::string`，我们随后将其用作 `name` 的初始化器。此时，`name` 正在查看临时的 `std::string`。然后临时的 `std::string` 被销毁，导致 `name` 变为悬空指针。当我们随后使用 `name` 时，会出现未定义行为。

> [!DANGER] 关于初始化 string_view
> 不要用 `std::string` 字面量初始化 `std::string_view`，因为这会导致 `std::string_view` 悬空。
> 可以使用 C 风格字符串字面量或 `std::string_view` 字面量来初始化 `std::string_view`。也可以使用 C 风格字符串对象、`std::string` 对象或 `std::string_view` 对象来初始化 `std::string_view`，只要该字符串对象的生命周期长于视图。

当底层字符串被修改时，我们也可能会遇到未定义行为：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    std::string s { "Hello, world!" };
    std::string_view sv { s }; // sv is now viewing s

    s = "Hello, a!";    // modifies s, which invalidates sv (s is still valid)
    std::cout << sv << '\n';   // undefined behavior

    return 0;
}
```

在这个例子中，`sv` 再次被设置为查看 `s`。然后对 `s` 进行了修改。当 `std::string` 被修改时，任何对该 `std::string` 的视图都可能会被**失效** ，这意味着这些视图现在是无效或不正确的。使用失效的视图将导致未定义行为。

### 重新验证一个无效的 `std::string_view`

无效的对象通常可以通过将其设置回已知的良好状态来重新验证（再次有效）。对于无效的 `std::string_view`，我们可以通过为无效的 `std::string_view` 对象分配一个有效的字符串来实现这一点。

这是与之前相同的示例，但我们将重新验证 `sv`：
```cpp
#include <iostream>
#include <string>
#include <string_view>

int main()
{
    std::string s { "Hello, world!" };
    std::string_view sv { s }; // sv is now viewing s

    s = "Hello, universe!";    // modifies s, which invalidates sv (s is still valid)
    std::cout << sv << '\n';   // undefined behavior

    sv = s;                    // revalidate sv: sv is now viewing s again
    std::cout << sv << '\n';   // prints "Hello, universe!"

    return 0;
}
```

在 `sv` 因 `s` 的修改而失效后，我们通过语句 `sv = s` 重新验证 `sv`，这使得 `sv` 再次成为 `s` 的有效视图。当我们第二次打印 `sv` 时，它输出“Hello, universe!”。

### 小心返回 `std::string_view`

`std::string_view` 可以用作函数的返回值。然而，这通常是危险的。

因为局部变量在函数结束时被销毁，返回一个查看局部变量的 `std::string_view` 将导致返回的 `std::string_view` 无效，进一步使用该 `std::string_view` 将导致未定义行为。例如：
```cpp
#include <iostream>
#include <string>
#include <string_view>

std::string_view getBoolName(bool b)
{
    std::string t { "true" };  // local variable
    std::string f { "false" }; // local variable

    if (b)
        return t;  // return a std::string_view viewing t

    return f; // return a std::string_view viewing f
} // t and f are destroyed at the end of the function

int main()
{
    std::cout << getBoolName(true) << ' ' << getBoolName(false) << '\n'; // undefined behavior

    return 0;
}
```

在上述示例中，当调用 `getBoolName(true)` 时，函数返回一个查看 `t` 的 `std::string_view`。然而，`t` 在函数结束时被销毁。这意味着返回的 `std::string_view` 正在查看一个已经被销毁的对象。因此，当打印返回的 `std::string_view` 时，会导致未定义行为。

**您的编译器可能会或可能不会对这种情况发出警告。**

有两种主要情况可以安全地返回 `std::string_view`。首先，由于 C 风格字符串字面量在整个程序中存在，从返回类型为 `std::string_view` 的函数中返回 C 风格字符串字面量是可以的（并且是有用的）。
```cpp
#include <iostream>
#include <string_view>

std::string_view getBoolName(bool b)
{
    if (b)
        return "true";  // return a std::string_view viewing "true"

    return "false"; // return a std::string_view viewing "false"
} // "true" and "false" are not destroyed at the end of the function

int main()
{
    std::cout << getBoolName(true) << ' ' << getBoolName(false) << '\n'; // ok

    return 0;
}
```

这将输出：
<pre>
true false
</pre>

当调用 `getBoolName(true)` 时，函数将返回一个 `std::string_view`，用于查看 C 风格字符串 `"true"`。因为 `"true"` 在整个程序中都存在，所以在 `main()` 中使用返回的 `std::string_view` 打印 `"true"` 时没有问题。

其次，返回类型为 `std::string_view` 的函数参数通常是可以的：
```cpp
#include <iostream>
#include <string>
#include <string_view>

std::string_view firstAlphabetical(std::string_view s1, std::string_view s2)
{
    if (s1 < s2)
        return s1;
    return s2;
}

int main()
{
    std::string a { "World" };
    std::string b { "Hello" };

    std::cout << firstAlphabetical(a, b) << '\n'; // prints "Hello"

    return 0;
}
```

这可能不太明显为什么这样是可以的。首先，请注意参数 `a` 和 `b` 存在于调用者的作用域中。当函数被调用时，函数参数 `s1` 是对 `a` 的视图，而函数参数 `s2` 是对 `b` 的视图。当函数返回 `s1` 或 `s2` 时，它是将对 `a` 或 `b` 的视图返回给调用者。由于此时 `a` 和 `b` 仍然存在，因此使用返回的 `std::string_view` 指向 `a` 或 `b` 是没问题的。

这里有一个重要的细微之处。如果参数是一个临时对象（将在包含函数调用的完整表达式结束时被销毁），那么 `std::string_view` 返回值必须在同一表达式中使用。在那之后，临时对象被销毁，std:: string_view 将变得悬空。


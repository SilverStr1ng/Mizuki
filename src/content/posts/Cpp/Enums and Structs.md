---
title: Enums and Structs
description: 枚举和结构体的简介，翻译自learncpp.com。
published: 2026-01-21
pinned: false
tags:
  - Cpp
  - CompoundTypes
  - Enum
  - Struct
draft: false
category: Cpp
created: 2026-01-21
---

## 程序定义（用户定义）类型的介绍

因为基本类型是作为 C++核心语言的一部分定义的，所以它们可以立即使用。例如，如果我们想定义一个类型为 `int` 或 `double` 的变量，我们只需这样做：
```cpp
int x; // 定义基本类型 int 的变量
double d; // 定义基本类型 double 的变量
```

这也适用于那些是基本类型简单扩展的复合类型（包括函数、指针、引用和数组）：
```cpp
void fcn(int) {}; // 定义类型为 void(int) 的函数
int* ptr; // 定义复合类型“指向 int 的指针”的变量
int& ref { x }; // 定义复合类型“int 引用”的变量（用 x 初始化）
int arr[5]; // 定义 5 个 int 的数组（int[5]，后续章节再讲）
```

这之所以可行，是因为 C++语言已经知道这些类型的名称（和符号）的含义——我们不需要提供或导入任何定义。

然而，考虑类型别名的案例，它允许我们为现有类型定义一个新名称。因为类型别名将一个新标识符引入到程序中，所以类型别名必须在它被使用之前定义：
```cpp
#include <iostream>

using Length = int; // 定义类型别名 Length

int main()
{
    Length x { 5 }; // 已在上面定义 Length，因此可以使用
    std::cout << x << '\n';

    return 0;
}
```

如果我们省略 `Length` 的定义，编译器将不知道 `Length` 是什么，当我们尝试使用该类型定义变量时会报错。 `Length` 的定义不会创建对象——它只是告诉编译器 `Length` 是什么，以便稍后使用。

### 什么是用户定义/程序定义类型？

当我们需要存储一个分数时，使用两个独立的整数分别存储分数的分子和分母时会遇到一些挑战。

如果 C++ 有一个内置的分数类型，那将很理想——但它没有。而且还有数百种其他可能有用的类型，C++ 也不可能预先包含，因为无法预见人们可能需要的一切（更不用说实现和测试这些功能了）。

相反，C++以不同的方式解决这些问题：通过允许创建全新的、自定义类型，我们可以在程序中使用这些类型！这种类型被称为<font color="#4dfe50">用户定义类型</font>(**user-defined types**)。然而，正如我们将在本课的后面讨论的那样，我们将更喜欢使用“<font color="#4dfe50">程序定义类型</font>(**program-defined types**)”这个术语来指代我们为在自己的程序中使用而创建的任何这种类型。

C++ 有两类复合类型可用于创建程序定义类型：
- 枚举类型（包括无作用域和作用域枚举）
- 类类型（包括结构体、类和联合）。

### 定义程序定义类型

和类型别名一样，程序定义类型也必须在使用前定义并命名。程序定义类型的定义称为<font color="#4dfe50">类型定义</font>(**type definition**)。

> [!NOTE] Insight
> 程序定义类型在使用前必须有名称和定义，而其他复合类型则不需要。
> 
> 函数不被视为用户定义类型（尽管它们在使用前需要命名和定义），因为命名和定义的是函数本身，而不是函数的类型。我们自己定义的函数被称为用户定义函数。

虽然我们还没有介绍 struct 是什么，这里有一个示例，展示了自定义 Fraction 类型的定义以及使用该类型创建对象的实例：
```cpp
// 定义名为 Fraction 的程序定义类型，让编译器知道 Fraction 是什么
//（struct 是什么以及如何使用将在本章后面解释）
// 这里只是定义类型的样子，并不会创建对象
struct Fraction
{
	int numerator {};
	int denominator {};
};

// 现在就可以使用 Fraction 类型了
int main()
{
    Fraction f { 3, 4 }; // 实际上创建了一个名为 f 的 Fraction 对象

	return 0;
}
```

在这个例子中，我们使用 `struct` 关键字来定义一个名为 `Fraction` 的新程序定义类型（在全局作用域中，所以它可以在文件的其余任何地方使用）。这不会分配任何内存——它只是告诉编译器 `Fraction` 的样子，以便我们之后可以分配 `Fraction` 类型的对象。然后，在 `main()` 中，我们实例化（并初始化）一个名为 `f` 的 `Fraction` 类型变量。

程序定义的类型定义必须以分号结束。在类型定义的末尾遗漏分号是一个常见的编程错误，并且难以调试，因为编译器可能会在类型定义之后的行出错。

> [!DANGER] 警告
> 别忘了在类型定义的末尾加上分号。

在下一节（无作用域的枚举）中，我们会展示更多示例；从结构体开始，我们将介绍结构体、成员和成员选择。

### 程序定义类型的命名

按照惯例，程序定义的类型以大写字母开头，并且不使用后缀（例如 `Fraction` ，而不是 `fraction` ， `fraction_t` 或 `Fraction_t` ）。

> [!SUCCESS] 最佳实践
> 给你的程序定义的类型以大写字母开头，并且不要使用后缀。

新程序员有时会因类型名和变量名之间的相似性而感到以下变量定义令人困惑：
```cpp
Fraction fraction {}; // 实例化一个名为 fraction 的 Fraction 变量
```

这与任何其他变量定义没有区别：类型（ `Fraction` ）首先出现（并且因为 Fraction 以大写字母开头，我们知道它是一个程序定义的类型），然后是变量名（ `fraction` ），然后是一个可选的初始化器。由于 C++ 区分大小写，这里没有命名冲突！

### 在整个多文件程序中使用程序定义类型

使用程序定义类型的每个代码文件在使用之前都需要看到完整的类型定义。前向声明是不够的。这是必要的，以便编译器知道为该类型的对象分配多少内存。

为了将类型定义传播到需要它们的代码文件中，程序定义类型通常在头文件中定义，然后被包含到任何需要该类型定义的代码文件中。这些头文件通常与程序定义类型的名称相同（例如，一个名为 Fraction 的程序定义类型会在 Fraction.h 中定义）

> [!SUCCESS] 最佳实践
> 仅在单个代码文件中使用的程序定义类型应该尽可能靠近首次使用点在该代码文件中定义。
> 
> 一个在多个代码文件中使用的程序定义类型，应该在一个与程序定义类型同名的头文件中定义，然后在每个代码文件中按需包含它。

如果我们将 Fraction 类型移动到一个头文件（命名为 Fraction.h）中，以便它能够被包含到多个代码文件中，它将如下所示：
```cpp title=Fraction.h
#ifndef FRACTION_H
#define FRACTION_H

// 定义一个名为 Fraction 的新类型
// 这里只定义 Fraction 的样子，不会创建对象
// 注意：这是完整定义，不是前向声明
struct Fraction
{
	int numerator {};
	int denominator {};
};

#endif
```

```cpp title=Fraction.cpp
#include "Fraction.h" // 将 Fraction 定义引入当前代码文件

// 现在可以使用 Fraction 类型了
int main()
{
    Fraction f{ 3, 4 }; // 实际创建了名为 f 的 Fraction 对象

	return 0;
}
```

### 类型定义在某种程度上可以豁免于单一定义规则（ODR）

单一定义规则要求每个函数和全局变量在每个程序中只能有一个定义。要在不包含定义的文件中使用某个函数或全局变量，我们需要一个前置声明（我们通常通过头文件来传播它）。这之所以可行，是因为对于函数和非 constexpr 变量，声明就足够让编译器满意，然后链接器可以将所有内容连接起来。

然而，以类似方式使用前向声明对类型不起作用，因为编译器通常需要看到完整的定义才能使用某个类型。我们必须能够将完整的类型定义传播到每个需要它的代码文件中。

为了实现这一点，类型在某种程度上可以豁免于单一定义规则：一个类型被允许在多个代码文件中定义。

你已经使用过这项功能（可能没有意识到）：如果你的程序有两个代码文件都包含 `#include <iostream>` ，你正在将所有的输入/输出类型定义导入到这两个文件中。

有两个值得注意的注意事项。首先，你仍然只能在每个代码文件中有一个类型定义（这通常不是问题，因为头文件保护会防止这种情况）。其次，给定类型的所有类型定义必须完全相同，否则会导致未定义行为。

### 命名：用户定义类型与程序定义类型

术语“用户定义类型”有时会在非正式谈话中提到，同时在 C++语言标准中也提及（但未定义）。在非正式谈话中，该术语通常指“在您自己的程序中定义的类型”（例如上述的 Fraction 类型示例）。

C++语言标准以非常规的方式使用了“用户定义类型”这一术语。在语言标准中，“用户定义类型”是指由你、标准库或实现（例如，由编译器定义以支持语言扩展的类型）定义的任何类类型或枚举类型。也许出乎意料的是，这意味着 `std::string` （在标准库中定义的类类型）被视为用户定义类型！

为了提供额外的区分，C++20 语言标准友好地定义了“程序定义类型”这一术语，其含义是指不属于标准库、实现或核心语言定义的类类型和枚举类型。换句话说，“程序定义类型”仅包括由我们（或第三方库）定义的类类型和枚举类型。

因此，当仅谈论我们为自身程序定义的类类型和枚举类型时，我们将更倾向于使用“程序定义”这一术语，因为它具有更精确的定义。


| 类型                   | 含义                                                      | 示例                                |
| -------------------- | ------------------------------------------------------- | --------------------------------- |
| Fundamental 基本类型     | 核心 C++语言内置的基本类型                                         | int, std::nullptr_t               |
| Compound 复合类型        | 以其他类型定义的类型                                              | int&，double*，std::string，Fraction |
| User-defined  用户定义类型 | 一个类类型或枚举类型<br>（包括在标准库或实现中定义的那些）<br>在非正式用法中，通常用来表示用户定义类型 | std::string, Fraction             |
| 程序定义类型               | 一个类类型或枚举类型<br>(排除标准库或实现中定义的)                            | Fraction                          |

## 无作用域的枚举

C++ 包含许多有用的基本和复合数据类型。但这些类型并不总是能满足我们想要完成的事情。

例如，假设你正在编写一个需要跟踪苹果是红色、黄色还是绿色，或者一件衬衫的颜色（从预设的颜色列表中选择）的程序。如果只有基本类型可用，你会如何实现这一点？

你可以将颜色存储为整数值，使用某种隐式映射（0 = 红色，1 = 绿色，2 = 蓝色）：
```cpp
int main()
{
    int appleColor{ 0 }; // 苹果是红色
    int shirtColor{ 1 }; // 衬衫是绿色

    return 0;
}
```

但这完全不够直观，我们可以通过使用符号常量来消除魔法数字：
```cpp
constexpr int red{ 0 };
constexpr int green{ 1 };
constexpr int blue{ 2 };

int main()
{
    int appleColor{ red };
    int shirtColor{ green };

    return 0;
}
```

虽然这样阅读起来稍微好一些，但程序员仍然需要推断出 `appleColor` 和 `shirtColor` （它们是 `int` 类型）的目的是用来存储颜色符号常量集中定义的值（这些常量很可能在其他地方定义，可能是在一个单独的文件中）。

我们可以通过使用类型别名使这个程序更清晰：
```cpp
using Color = int; // 定义名为 Color 的类型别名

// Color 类型应使用下面这些颜色值
constexpr Color red{ 0 };
constexpr Color green{ 1 };
constexpr Color blue{ 2 };

int main()
{
    Color appleColor{ red };
    Color shirtColor{ green };

    return 0;
}
```

我们更近了一步。阅读这段代码的人仍然需要理解这些颜色符号常量是用于 `Color` 类型的变量，但至少现在类型有一个唯一的名称，所以搜索 `Color` 的人能够找到相关联的符号常量集。

然而，因为 `Color` 只是 `int` 的一个别名，我们仍然存在一个问题，即没有强制使用这些颜色符号常量的正确方式。我们仍然可以做类似这样的事情：
```cpp
Color eyeColor{ 8 }; // 语法上合法，但语义上没有意义
```

此外，如果我们使用调试器调试这些变量，我们只会看到颜色的整数值（例如 `0` ），而不是其符号意义（ `red` ），这可能会使判断程序是否正确变得更加困难。

幸运的是，我们可以做得更好。

以 `bool` 类型为例。 `bool` 特别有趣之处在于它只有两个定义的值： `true` 和 `false` 。我们可以直接使用 `true` 或 `false` （作为字面量），或者我们可以实例化一个 `bool` 对象，让它持有这两个值中的一个。此外，编译器能够区分 `bool` 和其他类型。这意味着我们可以重载函数，并自定义当传递 `bool` 值时这些函数的行为。

如果我们能够定义自己的自定义类型，其中可以定义与该类型关联的命名值集，那么我们就会拥有一个完美的工具来优雅地解决上述挑战……

### 枚举类型

<font color="#4dfe50">枚举</font>(**enumeration**)（也称为<font color="#4dfe50">枚举类型</font>(**enumerated type 或 enum**）是一种复合数据类型，其值被限制为一系列命名的符号常量（称为<font color="#4dfe50">枚举器</font>(**enumerators**)）。

C++ 支持两种枚举类型：无作用域枚举（我们将在本节中介绍）和作用域枚举（我们将在稍后介绍）。

因为枚举是程序定义类型[[#程序定义（用户定义）类型的介绍]]，所以每个枚举都需要在使用前完全定义（前向声明是不够的）。

### 无作用域的枚举

无作用域的枚举通过 `enum` 关键字定义。

枚举类型最好通过示例来学习，所以让我们定义一个可以包含一些颜色值的无作用域枚举。我们将在下面解释其工作原理。
```cpp
// 定义一个名为 Color 的无作用域枚举
enum Color
{
    // 下面是枚举器
    // 这些符号常量定义了该类型可取的所有值
    // 枚举器之间用逗号分隔，而不是分号
    red,
    green,
    blue, // 尾随逗号可选，但建议保留
}; // 枚举定义必须以分号结束

int main()
{
    // 定义几个 Color 类型的变量
    Color apple { red };   // 苹果是红色
    Color shirt { green }; // 衬衫是绿色
    Color cup { blue };    // 杯子是蓝色

    Color socks { white }; // 错误：white 不是 Color 的枚举器
    Color hat { 2 };       // 错误：2 不是 Color 的枚举器

    return 0;
}
```

我们通过使用 `enum` 关键字开始示例，告诉编译器我们正在定义一个无作用域的枚举，我们将其命名为 `Color` 。

在一对花括号内，我们定义了 `Color` 类型的枚举器： `red` 、 `green` 和 `blue` 。这些枚举器定义了类型 `Color` 被限制的具体值。每个枚举器之间必须用逗号（而不是分号）分隔——最后一个枚举器后的尾随逗号是可选的，但为了保持一致性建议使用。

通常每行定义一个枚举器，但在简单情况下（枚举器数量较少且不需要注释），它们可以全部定义在同一行上。

`Color` 的类型定义以分号结束。我们现在已经完全定义了枚举类型 `Color` 是什么！

在 `main()` 中，我们实例化了三个 `Color` 类型的变量： `apple` 以颜色 `red` 初始化， `shirt` 以颜色 `green` 初始化， `cup` 以颜色 `blue` 初始化。为每个对象分配了内存。请注意，枚举类型的初始化器必须是该类型定义的枚举器之一。变量 `socks` 和 `hat` 导致编译错误，因为初始化器 `white` 和 `2` 不是 `Color` 的枚举器。

枚举器是隐式 constexpr。

> [!TIP] 提醒
> 快速回顾一下命名规则：
> - 枚举或枚举类型本身就是程序定义的类型（例如 `Color` ）。
> - 枚举器是属于枚举的特定命名值（例如 `red` ）。

### 命名枚举和枚举器

按照惯例，枚举类型的名称以大写字母开头（所有程序定义的类型都是这样）。

> [!DANGER] 警告
> 枚举类型不必命名，但在现代 C++中应避免使用未命名的枚举类型。

枚举器必须被赋予名称。不幸的是，对于枚举器名称没有通用的命名约定。常见的选择包括以小写字母开头（例如 red）、以大写字母开头（Red）、全部大写（RED）、全部大写并带有前缀（COLOR_RED），或者以“k”为前缀并首字母大写（kColorRed）。

现代 C++指南通常建议避免使用全部大写的命名约定，因为全部大写通常用于预处理宏，并可能产生冲突。我们还建议避免以大写字母开头的命名约定，因为以大写字母开头的名称通常保留用于程序定义的类型。

> [!SUCCESS] 最佳实践
> 为你的枚举类型命名时，以大写字母开头。为你的枚举器命名时，以小写字母开头。

### 枚举类型是不同的类型

你创建的每个枚举类型都被视为一个不同的类型，这意味着编译器可以将其与其他类型区分开来（与 typedefs 或 type aliases 不同，它们被视为与其所替代的类型非不同）。

因为枚举类型是不同的，一个枚举类型中定义的枚举器不能与另一个枚举类型的对象一起使用：
```cpp
enum Pet
{
    cat,
    dog,
    pig,
    whale,
};

enum Color
{
    black,
    red,
    blue,
};

int main()
{
    Pet myPet { black }; // 编译错误：black 不是 Pet 的枚举器
    Color shirt { pig }; // 编译错误：pig 不是 Color 的枚举器

    return 0;
}
```

你本来就不想要一件猪图案的衬衫。

### 使用枚举

因为枚举器具有描述性，它们有助于增强代码文档和可读性。当您有一组相关的常量，并且对象只需要在某个时刻持有这些值中的一个时，枚举类型最为适用。

常见的枚举定义包括星期几、方位方向以及一副纸牌中的花色：
```cpp
enum DaysOfWeek
{
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
};

enum CardinalDirections
{
    north,
    east,
    south,
    west,
};

enum CardSuits
{
    clubs,
    diamonds,
    hearts,
    spades,
};
```

有时函数会向调用者返回一个状态码，以指示函数是否执行成功或遇到错误。传统上，使用小的负数来表示不同的可能错误码。例如：
```cpp
int readFileContents()
{
    if (!openFile())
        return -1;
    if (!readFile())
        return -2;
    if (!parseFile())
        return -3;

    return 0; // 成功
}
```

然而，使用这种魔法数字并不是很描述性。更好的方法是使用枚举类型：
```cpp
enum FileReadResult
{
    readResultSuccess,
    readResultErrorFileOpen,
    readResultErrorFileRead,
    readResultErrorFileParse,
};

FileReadResult readFileContents()
{
    if (!openFile())
        return readResultErrorFileOpen;
    if (!readFile())
        return readResultErrorFileRead;
    if (!parseFile())
        return readResultErrorFileParse;

    return readResultSuccess;
}
```

然后调用者可以将函数的返回值与相应的枚举器进行比较，这比测试特定整数值的返回结果更容易理解。
```cpp
if (readFileContents() == readResultSuccess)
{
    // 做点事情
}
else
{
    // 打印错误信息
}
```

枚举类型在游戏中也能发挥良好作用，用于识别不同类型的物品、怪物或地形。基本上，任何一组相关的对象都可以使用枚举类型。

例如:
```cpp
enum ItemType
{
	sword,
	torch,
	potion,
};

int main()
{
	ItemType holding{ torch };

	return 0;
}
```

枚举类型也可以在用户需要在两个或多个选项之间做出选择时，作为有用的函数参数：
```cpp
enum SortOrder
{
    alphabetical,
    alphabeticalReverse,
    numerical,
};

void sortData(SortOrder order)
{
    switch (order)
    {
        case alphabetical:
            // 按字母顺序正向排序
            break;
        case alphabeticalReverse:
            // 按字母顺序逆向排序
            break;
        case numerical:
            // 按数值排序
            break;
    }
}
```

许多语言使用枚举来定义布尔值——毕竟，布尔值本质上只是一个具有两个枚举器的枚举： `false` 和 `true` ！然而，在 C++中， `true` 和 `false` 被定义为关键字而不是枚举器。

因为枚举类型占用空间小且复制成本低，所以通过值传递（和返回）是没问题的。

### 无作用域枚举的作用域

无作用域的枚举之所以这样命名，是因为它们将它们的枚举器名称放入与枚举定义本身相同的范围内（与命名空间创建新的作用域区域不同）。

例如，给定以下程序：
```cpp
enum Color // 该枚举定义在全局命名空间
{
    red, // 因而 red 也进入全局命名空间
    green,
    blue,
};

int main()
{
    Color apple { red }; // 苹果是红色

    return 0;
}
```

`Color` 枚举定义在全局作用域中。因此，所有枚举名称（ `red` 、 `green` 和 `blue` ）也进入全局作用域。这污染了全局作用域，并显著增加了命名冲突的可能性。

这导致一个后果是，在同一个作用域内的多个枚举中不能使用相同的枚举器名称：
```cpp
enum Color
{
    red,
    green,
    blue, // blue 被放入全局命名空间
};

enum Feeling
{
    happy,
    tired,
    blue, // 错误：与上面的 blue 命名冲突
};

int main()
{
    Color apple { red }; // 苹果是红色
    Feeling me { happy }; // 我现在很开心（尽管程序无法编译）

    return 0;
}
```

在上面的示例中，两个无作用域的枚举（ `Color` 和 `Feeling` ）都将具有相同名称 `blue` 的枚举器放入全局作用域。这会导致命名冲突并引发后续的编译错误。

无作用域的枚举也为其枚举器提供了一个命名的作用域区域（类似于命名空间为其中声明的名称提供的作用域区域）。这意味着我们可以按以下方式访问无作用域枚举的枚举器：
```cpp
enum Color
{
    red,
    green,
    blue, // blue 被放入全局命名空间
};

int main()
{
    Color apple { red }; // 可以，直接从全局命名空间访问枚举器
    Color raspberry { Color::red }; // 也可以，从 Color 的作用域访问枚举器

    return 0;
}
```

通常情况下，无作用域枚举器会直接访问，而无需使用作用域解析运算符。

### 避免枚举器命名冲突

防止无作用域枚举器命名冲突有几种常见方法。

一种选择是为每个枚举器加上枚举本身的名称作为前缀：
```cpp
enum Color
{
    color_red,
    color_blue,
    color_green,
};

enum Feeling
{
    feeling_happy,
    feeling_tired,
    feeling_blue, // 不再与 color_blue 发生命名冲突
};

int main()
{
    Color paint { color_blue };
    Feeling me { feeling_blue };

    return 0;
}
```

这仍然会污染命名空间，但通过使名称更长和更独特，减少了命名冲突的可能性。

更好的选择是将枚举类型放在提供单独作用域区域的东西中，例如命名空间：
```cpp
namespace Color
{
    // Color、red、blue、green 都定义在命名空间 Color 内
    enum Color
    {
        red,
        green,
        blue,
    };
}

namespace Feeling
{
    enum Feeling
    {
        happy,
        tired,
        blue, // Feeling::blue 不会与 Color::blue 冲突
    };
}

int main()
{
    Color::Color paint{ Color::blue };
    Feeling::Feeling me{ Feeling::blue };

    return 0;
}
```

这意味着我们现在必须用作用域区域的名称来前缀我们的枚举和枚举器名称。

一个相关的选项是使用一个作用域枚举（它定义了自己的作用域区域）。我们很快会讨论作用域枚举。

> [!SUCCESS] 最佳实践
> 建议将你的枚举放在一个命名的作用域区域（例如命名空间或类）内，这样枚举器就不会污染全局命名空间。

或者，如果枚举仅在单个函数体内使用，则应将枚举定义在函数内部。这将限制枚举及其枚举器的作用域仅限于该函数。这种枚举的枚举器将遮蔽全局作用域中定义的具有相同名称的枚举器。

### 枚举器比较

我们可以使用相等运算符（ `operator==` 和 `operator!=` ）来测试一个枚举是否具有某个特定枚举器的值。
```cpp
#include <iostream>

enum Color
{
    red,
    green,
    blue,
};

int main()
{
    Color shirt{ blue };

    if (shirt == blue) // 如果衬衫是蓝色
        std::cout << "Your shirt is blue!";
    else
        std::cout << "Your shirt is not blue!";

    return 0;
}
```

在上述示例中，我们使用了一个 if 语句来测试 `shirt` 是否等于枚举器 `blue` 。这为我们提供了一种根据枚举器所持有的值来条件化程序行为的方法。

## 无作用域枚举器整数转换

在上一节，我们提到枚举器是符号常量。但我们当时没有告诉你的事是，这些枚举器具有整型类型的值。

这与字符的情况类似。考虑：
```cpp
char ch { 'A' };
```

一个字符实际上只是一个 1 字节的整数值，字符 `'A'` 被转换为整数值（在这种情况下， `65` ），然后被存储。

当我们定义一个枚举时，每个枚举器都会根据其在枚举器列表中的位置自动关联到一个整数值。默认情况下，第一个枚举器被赋予整数值 `0` ，而每个后续的枚举器都有一个比前一个枚举器大 1 的值：
```cpp
enum Color
{
    black,   // 0
    red,     // 1
    blue,    // 2
    green,   // 3
    white,   // 4
    cyan,    // 5
    yellow,  // 6
    magenta, // 7
};

int main()
{
    Color shirt{ blue }; // shirt 实际存储的整数值为 2

    return 0;
}
```

可以显式定义枚举器的值。这些整数值可以是正数或负数，并且可以与其他枚举器共享相同的值。任何未定义的枚举器会被赋予比前一个枚举器大 1 的值。
```cpp
enum Animal
{
    cat = -3,    // 值可以是负数
    dog,         // -2
    pig,         // -1
    horse = 5,
    giraffe = 5, // 与 horse 共享同一数值
    chicken,     // 6
};
```

注意在这种情况下， `horse` 和 `giraffe` 被赋予了相同的值。当这种情况发生时，枚举器就变得不再区分——本质上， `horse` 和 `giraffe` 可以互换。尽管 C++ 允许这样做，但在同一枚举中给两个枚举器赋予相同的值通常应该避免。

大多数情况下，枚举器的默认值正是你所需要的，所以除非你有特定的理由，否则不要提供自己的值。
> [!SUCCESS] 最佳实践
> 除非你有充分的理由，否则避免给你的枚举器赋予显式值。

### 为枚举进行值初始化

如果一个枚举被零初始化（这发生在我们使用值初始化时），即使没有与之对应的枚举值，枚举也会被赋予值 `0` 。
```cpp
#include <iostream>

enum Animal
{
    cat = -3,    // -3
    dog,         // -2
    pig,         // -1
    // 注意：该列表中没有值为 0 的枚举器
    horse = 5,   // 5
    giraffe = 5, // 5
    chicken,     // 6
};

int main()
{
    Animal a {}; // 值初始化会将 a 置为 0
    std::cout << a; // 输出 0

    return 0;
}
```

这有两个语义后果：
- 如果有枚举值是 0，值初始化会将枚举默认为该枚举值的意义。例如，使用之前的 `enum Color` 示例，一个值初始化的 `Color` 将默认为 `black` 。因此，建议考虑将值为 0 的枚举设为最适合你枚举的默认意义。

类似这样可能会引起问题：
```cpp
enum UniverseResult
{
    destroyUniverse, // 默认值（0）
    saveUniverse
};
```

- 如果没有值为 0 的枚举器，值初始化很容易创建一个语义上无效的枚举。在这种情况下，我们建议添加一个值为 0 的“无效”或“未知”枚举器，以便为该状态的意义提供文档说明，并为你提供一个可以显式处理的该状态名称。
```cpp
enum Winner
{
    winnerUnknown, // 默认值（0）
    player1,
    player2,
};

// 代码中后续某处
if (w == winnerUnknown) // 适当处理该情况
```

> [!SUCCESS] 最佳实践
> 使代表 0 的枚举器成为你枚举的最佳默认含义。如果没有好的默认含义，可以考虑添加一个值为 0 的“无效”或“未知”枚举器，以便状态被明确记录，并在适当的地方被明确处理。

### 无作用域的枚举将隐式转换为整数值

尽管枚举存储整数值，但它们不被视为整型（它们是复合类型）。然而，无作用域的枚举将隐式转换为整数值。因为枚举器是编译时常量，所以这是一种 constexpr 转换。

考虑以下程序：
```cpp
#include <iostream>

enum Color
{
    black, // 分配为 0
    red, // 分配为 1
    blue, // 分配为 2
    green, // 分配为 3
    white, // 分配为 4
    cyan, // 分配为 5
    yellow, // 分配为 6
    magenta, // 分配为 7
};

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << shirt << '\n'; // 这会输出什么？

    return 0;
}
```

由于枚举类型持有整数值，正如你所预期的，这将打印：
<pre>
Your shirt is 2
</pre>

当枚举类型在函数调用或运算符中使用时，编译器会首先尝试查找与枚举类型匹配的函数或运算符。例如，当编译器尝试编译 `std::cout << shirt` 时，编译器会首先查看 `operator<<` 是否知道如何打印类型为 `Color` 的对象（因为 `shirt` 是类型为 `Color` ），但 `operator<<` 不知道。

由于编译器找不到匹配项，它会接着检查 `operator<<` 是否知道如何打印未限定枚举转换成的整型对象。由于它知道， `shirt` 中的值会被转换成整数值并作为整数值 `2` 打印出来。

### 枚举的大小和底层类型（基类型）

枚举器具有整型值的属性。但具体是哪种整型？用于表示枚举器值的特定整型被称为枚举的<font color="#4dfe50">底层类型</font>(**underlying type**)（或<font color="#4dfe50">基类型</font>(**base**)）。

对于无作用域的枚举，C++标准没有指定应使用哪种具体的整型作为底层类型，因此选择是实施定义的。大多数编译器会将 `int` 作为底层类型使用（意味着无作用域的枚举将与 `int` 的大小相同），除非需要更大的类型来存储枚举值。但你不应假设这一点对每个编译器或平台都适用。

可以显式指定枚举的底层类型。底层类型必须是整型。例如，如果你在一些对带宽敏感的上下文中工作（例如通过网络发送数据），你可能希望为你的枚举指定一个较小的类型：
```cpp
#include <cstdint>  // 用于 std::int8_t
#include <iostream>

// 使用 8 位整数作为枚举的底层类型
enum Color : std::int8_t
{
    black,
    red,
    blue,
};

int main()
{
    Color c{ black };
    std::cout << sizeof(c) << '\n'; // 输出 1（字节）

    return 0;
}
```

> [!SUCCESS] 最佳实践
> 仅在必要时指定枚举的基类型。

> [!DANGER] 警告
> 因为 `std::int8_t` 和 `std::uint8_t` 通常是 char 类型的类型别名，所以使用这两种类型作为枚举的基类型很可能会导致枚举值以 char 值的形式打印，而不是 int 值。

### 整数到无作用域枚举的转换

虽然编译器会隐式地将无作用域枚举转换为整数，但它不会隐式地将整数转换为无作用域枚举。以下将产生编译器错误：
```cpp
enum Pet // 未指定基类型
{
    cat, // 分配为 0
    dog, // 分配为 1
    pig, // 分配为 2
    whale, // 分配为 3
};

int main()
{
    Pet pet { 2 }; // 编译错误：整数 2 不会隐式转换为 Pet
    pet = 3;       // 编译错误：整数 3 不会隐式转换为 Pet

    return 0;
}
```

有两种方法可以解决这个问题。

首先，你可以使用 `static_cast` 显式地将一个整数转换为无作用域的枚举器：
```cpp
enum Pet // 未指定基类型
{
    cat, // 分配为 0
    dog, // 分配为 1
    pig, // 分配为 2
    whale, // 分配为 3
};

int main()
{
    Pet pet { static_cast<Pet>(2) }; // 将整数 2 转为 Pet
    pet = static_cast<Pet>(3);       // 小猪“进化”为鲸鱼！

    return 0;
}
```

我们将在后续“[[#将枚举类型转换为字符串和从字符串转换]]”中看到一个例子，在那里我们使用这个特性。

将任何由目标枚举的枚举器表示的整数值 static_cast 为该枚举是安全的。由于我们的 `Pet` 枚举具有值为 `0` 、 `1` 、 `2` 和 `3` 的枚举器，将整数值 `0` 、 `1` 、 `2` 和 `3` static_cast 为 `Pet` 是有效的。

即使没有表示该值的枚举器，将目标枚举的底层类型的范围内的任何整数值 static_cast 也是安全的。将底层类型范围之外的值 static_cast 将导致未定义行为。

> [!CITE] 高级
> 如果枚举有明确定义的底层类型，枚举的范围与底层类型的范围相同。
> 
> 如果枚举没有显式的底层类型，情况会稍微复杂一些。在这种情况下，编译器可以自行选择底层类型，只要所有枚举值都能适合该类型，它可以选择任何有符号或无符号类型。基于这一点，只有当静态转换的整数值适合能容纳所有枚举值的最小位数范围时，才是安全的。
> 
> 让我们通过两个例子来说明这一点：
> - 对于具有值 2、9 和 12 的枚举器，这些枚举器可以最小限度地适应一个范围在 0 到 15 的无符号 4 位整型。因此，只有将 0 到 15 的整数值静态转换为这种枚举类型是安全的。
> - 对于具有值-28、2 和 6 的枚举器，这些枚举器可以最小限度地适应一个范围在-32 到 31 的有符号 6 位整型。因此，只有将整数值-32 到 31 静态转换为这种枚举类型是安全的。

其次，自 C++17 起，如果一个无作用域的枚举有明确指定的基类型，那么编译器将允许你使用整数值列表初始化一个无作用域的枚举：
```cpp
enum Pet: int // 已指定基类型
{
    cat, // 分配为 0
    dog, // 分配为 1
    pig, // 分配为 2
    whale, // 分配为 3
};

int main()
{
    Pet pet1 { 2 }; // 可以：指定基类型后可用整数进行列表初始化（C++17）
    Pet pet2 (2);   // 编译错误：不能用整数直接初始化
    Pet pet3 = 2;   // 编译错误：不能用整数拷贝初始化

    pet1 = 3;       // 编译错误：不能用整数赋值

    return 0;
}
```

## 将枚举类型转换为字符串和从字符串转换

在上一节中，我们展示了一个这样的例子：
```cpp
#include <iostream>

enum Color
{
    black, // 0
    red,   // 1
    blue,  // 2
};

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << shirt << '\n';

    return 0;
}
```

这段代码输出：
<pre>
Your shirt is 2
</pre>

因为 `operator<<` 不知道如何打印 `Color` ，编译器将隐式地将 `Color` 转换为整数值并打印该值。

大多数情况下，将枚举作为整数值（如 `2` ）打印并不是我们想要的。相反，我们通常想要打印枚举所代表的名称（例如 `blue` ）。C++没有内置的方法来做这件事，所以我们必须自己找到解决方案。幸运的是，这并不难。

### 获取枚举的名称

获取枚举器名称的典型方法是为我们提供一个枚举器并返回枚举器名称作为字符串的函数。但这需要某种方式来确定给定枚举器应返回哪个字符串。

有两种常见方法可以实现这一点。

在以下示例中，我们使用 switch 语句选择一个枚举器并返回该枚举器相应的颜色字符串字面量：
```cpp
#include <iostream>
#include <string_view>

enum Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    constexpr Color shirt{ blue };

    std::cout << "Your shirt is " << getColorName(shirt) << '\n';

    return 0;
}
```

这段代码输出：
<pre>
Your shirt is blue
</pre>

在上述示例中，我们基于 `color` 进行切换，它包含我们传递的枚举器。在 switch 语句内部，我们对 `Color` 的每个枚举器都有一个 case 标签。每个 case 返回相应颜色的名称作为 C 风格字符串字面量。这个 C 风格字符串字面量被隐式转换为 `std::string_view` ，并返回给调用者。我们还包含了一个 default case，在用户传递了未预期的值时返回 `"???"` 。

> [!WARNING] 提醒
> 由于整个程序中存在 C 风格字符串字面量，因此返回一个正在查看 C 风格字符串字面量的 `std::string_view` 是没问题的。当 `std::string_view` 被复制回调用者时，正在查看的 C 风格字符串字面量仍然存在。

该函数是 constexpr，这样我们就可以在常量表达式中使用颜色的名称。

虽然这能让我们获取枚举器的名称，但如果想将这个名称打印到控制台，必须执行 `std::cout << getColorName(shirt)` ，这不如 `std::cout << shirt` 方便。我们将在接下来的 [[#I/O 运算符重载简介]] 中，教 `std::cout` 如何打印枚举器。

解决将枚举器映射到字符串的程序的第二种方法是使用数组。

### 无作用域枚举器输入

现在让我们来看一个输入的例子。在以下示例中，我们定义了一个 `Pet` 枚举。因为 `Pet` 是一个用户定义类型，语言不知道如何使用 `std::cin` 输入 `Pet` 。
```cpp
#include <iostream>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

int main()
{
    Pet pet { pig };
    std::cin >> pet; // 编译错误：std::cin 不知道如何输入 Pet

    return 0;
}
```

一种简单的解决方法是读取一个整数，并使用 `static_cast` 将整数转换为相应枚举类型的枚举器：
```cpp
#include <iostream>
#include <string_view>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???";
    }
}

int main()
{
    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // 输入一个整数

    if (input < 0 || input > 3)
        std::cout << "You entered an invalid pet\n";
    else
    {
        Pet pet{ static_cast<Pet>(input) }; // 将整数 static_cast 为 Pet
        std::cout << "You entered: " << getPetName(pet) << '\n';
    }

    return 0;
}
```

虽然这样可行，但有点别扭。另外请注意，只有当我们知道 `input` 在枚举器的范围内时，才应该 `static_cast<Pet>(input)` 。

### 从一个字符串获取枚举

与其输入一个数字，如果用户能输入一个表示枚举器的字符串（例如“pig”），然后我们再将这个字符串转换为相应的 `Pet` 枚举器，那就更好了。然而，这样做需要我们解决几个挑战。

首先，我们不能对字符串进行 switch 操作，因此需要使用其他方法来匹配用户传入的字符串。在这里最简单的方法是使用一系列 if 语句。

其次，如果用户传入一个无效字符串，我们应该返回哪个 `Pet` 枚举值？一个选项是添加一个枚举值来表示“无/无效”，然后返回那个值。然而，更好的选项是使用 `std::optional` 。
```cpp
#include <iostream>
#include <optional> // 用于 std::optional
#include <string>
#include <string_view>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???";
    }
}

constexpr std::optional<Pet> getPetFromString(std::string_view sv)
{
    // switch 只能用于整型（或枚举），不能用于字符串
    // 所以这里必须使用 if 语句
    if (sv == "cat")   return cat;
    if (sv == "dog")   return dog;
    if (sv == "pig")   return pig;
    if (sv == "whale") return whale;

    return {};
}

int main()
{
    std::cout << "Enter a pet: cat, dog, pig, or whale: ";
    std::string s{};
    std::cin >> s;

    std::optional<Pet> pet { getPetFromString(s) };

    if (!pet)
        std::cout << "You entered an invalid pet\n";
    else
        std::cout << "You entered: " << getPetName(*pet) << '\n';

    return 0;
}
```

在上述解决方案中，我们使用一系列 if-else 语句进行字符串比较。如果用户的输入字符串与某个枚举器字符串匹配，我们就返回相应的枚举器。如果没有任何字符串匹配，我们返回 `{}` ，这意味着“无值”。

#### 对于高级读者

请注意，上述解决方案仅匹配小写字母。如果您想匹配任何字母大小写，可以使用以下函数将用户的输入转换为小写：
```cpp
#include <algorithm> // 用于 std::transform
#include <cctype>    // 用于 std::tolower
#include <iterator>  // 用于 std::back_inserter
#include <string>
#include <string_view>

// 该函数返回一个 std::string，内容是传入 std::string_view 的小写版本
// 仅支持 1:1 的字符映射
std::string toASCIILowerCase(std::string_view sv)
{
    std::string lower{};
    std::transform(sv.begin(), sv.end(), std::back_inserter(lower),
        [](char c)
        {
            return static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
        });
    return lower;
}
```

这个函数遍历 `std::string_view sv` 中的每个字符，使用 `std::tolower()` （借助 lambda）将其转换为小写字符，然后将这个小写字符追加到 `lower` 。

## I/O 运算符重载简介

在上一课（[[#将枚举类型转换为字符串和从字符串转换]]），我们展示了这个例子，其中我们使用一个函数将枚举转换为等效的字符串：
```cpp
#include <iostream>
#include <string_view>

enum Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    constexpr Color shirt{ blue };

    std::cout << "Your shirt is " << getColorName(shirt) << '\n';

    return 0;
}
```

尽管上述例子工作得很好，但有两个缺点：
- 我们必须记住我们创建的用于获取枚举器名称的函数的名称。
- 必须调用这样的函数，这会使我们的输出语句变得杂乱。

理想情况下，我们希望以某种方式教会 `operator<<` 输出一个枚举，这样我们就可以做类似 `std::cout << shirt` 的事情，并让它按我们的预期工作。

### 运算符重载简介

函数重载允许我们创建多个具有相同名称的函数，只要每个函数具有唯一的函数原型。通过函数重载，我们可以创建适用于不同数据类型的函数变体，而无需为每个变体想出一个独特的名称。

类似地，C++也支持<font color="#4dfe50">运算符重载</font>(**operator overloading**)，它允许我们定义现有运算符的重载，以便我们可以让这些运算符与我们的程序定义的数据类型一起工作。

基本运算符重载相当直接：
- 使用运算符的名称作为函数的名称来定义一个函数。
- 为每个操作数添加适当类型的参数（按从左到右的顺序）。其中必须有一个参数是用户定义的类型（类类型或枚举类型），否则编译器会报错。
- 将返回类型设置为任何有意义的类型。
- 使用 return 语句返回操作的结果。

当编译器遇到表达式中使用运算符，并且一个或多个操作数是用户定义类型时，编译器会检查是否有可用的重载运算符函数来解析该调用。例如，对于某个表达式 `x + y` ，编译器将使用函数重载解析来查看是否有 `operator+(x, y)` 函数调用可以用来计算该操作。如果找到一个非歧义的 `operator+` 函数，它将被调用，并且操作的结果作为返回值返回。

### 重载 `operator<<` 以打印枚举值

在我们继续之前，让我们快速回顾一下当 `operator<<` 用于输出时它是如何工作的。

考虑一个简单的表达式，如 `std::cout << 5` 。 `std::cout` 的类型是 `std::ostream` （这是标准库中的一个用户定义类型），而 `5` 是一个类型为 `int` 的字面量。

当这个表达式被评估时，编译器将寻找一个可以处理类型为 `std::ostream` 和 `int` 的参数的重载 `operator<<` 函数。它会找到一个这样的函数（该函数也是标准 I/O 库的一部分），并调用它。在该函数内部，使用 `std::cout` 将 `x` 输出到控制台（具体如何实现是未定义的）。最后， `operator<<` 函数返回其左操作数（在这种情况下是 `std::cout` ），以便后续的 `operator<<` 调用可以链式进行。

考虑到以上内容，让我们实现一个重载 `operator<<` 以打印 `Color` 的功能：
```cpp
#include <iostream>
#include <string_view>

enum Color
{
	black,
	red,
	blue,
};

constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

// 教 operator<< 如何输出 Color
// std::ostream 是 std::cout、std::cerr 等的类型
// 返回类型和参数类型使用引用（避免拷贝）
std::ostream& operator<<(std::ostream& out, Color color)
{
    out << getColorName(color); // 将颜色名称写入输出流 out
    return out;                 // operator<< 通常返回其左操作数

    // 以上内容可简写为：
    // 可写作：return out << getColorName(color)
}

int main()
{
	Color shirt{ blue };
    std::cout << "Your shirt is " << shirt << '\n'; // 可以正常工作！

	return 0;
}
```

这段代码输出:
<pre>
Your shirt is blue
</pre>

让我们稍微展开一下重载运算符函数。首先，函数的名称是 `operator<<` ，因为这是我们要重载的运算符的名称。 `operator<<` 有两个参数。左参数（将与左操作数匹配）是我们输出流，其类型为 `std::ostream` 。我们使用非 const 引用传递，因为我们不希望在函数被调用时复制一个 `std::ostream` 对象，但 `std::ostream` 对象需要被修改才能进行输出。右参数（将与右操作数匹配）是我们的 `Color` 对象。由于 `operator<<` 通常返回其左操作数，因此返回类型与左操作数的类型匹配，即 `std::ostream&` 。

现在让我们来看一下实现。一个 `std::ostream` 对象已经知道如何使用 `operator<<` 打印一个 `std::string_view` （这作为标准库的一部分）。所以 `out << getColorName(color)` 只是获取我们颜色的名称作为 `std::string_view` ，然后将其打印到输出流中。

请注意，我们的实现使用参数 `out` 而不是 `std::cout` ，因为我们希望允许调用者确定他们将要输出到哪个输出流（例如 `std::cerr << color` 应该输出到 `std::cerr` ，而不是 `std::cout` ）。

返回左操作数也很简单。左操作数是参数 `out` ，所以我们只需返回 `out` 。

将所有内容整合起来：当我们调用 `std::cout << shirt` 时，编译器会看到我们已经重载了 `operator<<` 以与类型为 `Color` 的对象一起工作。然后，我们的重载 `operator<<` 函数被调用，以 `std::cout` 作为 `out` 参数，以及我们的 `shirt` 变量（其值为 `blue` ）作为参数 `color` 。由于 `out` 是对 `std::cout` 的引用，而 `color` 是枚举器 `blue` 的副本，因此表达式 `out << getColorName(color)` 将 `"blue"` 打印到控制台。最后，如果我们要链接额外的输出， `out` 将返回给调用者。

### 重载 `operator>>` 以输入枚举器

类似于我们之前教 `operator<<` 输出枚举类型，我们也可以教 `operator>>` 输入枚举类型：
```cpp
#include <iostream>
#include <limits>
#include <optional>
#include <string>
#include <string_view>

enum Pet
{
    cat,   // 0
    dog,   // 1
    pig,   // 2
    whale, // 3
};

constexpr std::string_view getPetName(Pet pet)
{
    switch (pet)
    {
    case cat:   return "cat";
    case dog:   return "dog";
    case pig:   return "pig";
    case whale: return "whale";
    default:    return "???";
    }
}

constexpr std::optional<Pet> getPetFromString(std::string_view sv)
{
    if (sv == "cat")   return cat;
    if (sv == "dog")   return dog;
    if (sv == "pig")   return pig;
    if (sv == "whale") return whale;

    return {};
}

// pet 是输入/输出参数
std::istream& operator>>(std::istream& in, Pet& pet)
{
    std::string s{};
    in >> s; // 获取用户输入的字符串

    std::optional<Pet> match { getPetFromString(s) };
    if (match) // 找到匹配项
    {
        pet = *match; // 解引用 std::optional 得到匹配的枚举器
        return in;
    }

    // 没有找到匹配项，输入无效
    // 将输入流设置为失败状态
    in.setstate(std::ios_base::failbit);

    // 提取失败时，operator>> 会将基础类型置为 0
    // 取消下面一行的注释，让该运算符也有相同行为
    // pet = {};

    return in;
}

int main()
{
    std::cout << "Enter a pet: cat, dog, pig, or whale: ";
    Pet pet{};
    std::cin >> pet;

    if (std::cin) // 找到了匹配项
        std::cout << "You chose: " << getPetName(pet) << '\n';
    else
    {
        std::cin.clear(); // 重置输入流为正常状态
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Your pet was not valid\n";
    }

    return 0;
}
```

这里有几个输出案例中值得注意的不同之处。首先， `std::cin` 的类型是 `std::istream` ，因此我们使用 `std::istream&` 作为我们的左参数和返回值的类型，而不是 `std::ostream&` 。其次， `pet` 参数是一个非 const 引用。这允许我们的 `operator>>` 修改传入的右操作数的值，如果我们的提取结果匹配的话。

> [!NOTE] 洞察
> 我们的右操作数（ `pet` ）是一个输出参数。
> 
> 如果 `pet` 是一个值参数而不是引用参数，那么我们的 `operator>>` 函数最终会为右操作数的副本分配一个新值，而不是实际右操作数。在这种情况下，我们希望右操作数被修改。

在函数内部，我们使用 `operator>>` 输入一个 `std::string` （它已经知道如何做）。如果用户输入的值与我们的宠物之一匹配，那么我们可以将 `pet` 分配给相应的枚举器并返回左操作数（ `in` ）。

如果用户没有输入一个有效的宠物，那么我们通过将 `std::cin` 置于“失败模式”来处理这种情况。这是 `std::cin` 在提取失败时通常进入的状态。调用者可以检查 `std::cin` 以确定提取是否成功或失败。

## 带作用域的枚举 (enum classes)

尽管在 C++中未命名枚举是不同的类型，但它们不是类型安全的，在某些情况下会允许你做一些没有意义的事情。考虑以下情况：
```cpp
#include <iostream>

int main()
{
    enum Color
    {
        red,
        blue,
    };

    enum Fruit
    {
        banana,
        apple,
    };

    Color color { red };
    Fruit fruit { banana };

    if (color == fruit) // 编译器会将 color 和 fruit 当作整数比较
        std::cout << "color and fruit are equal\n"; // 结果认为它们相等！
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

这段代码输出：
<pre>
color and fruit are equal
</pre>

当比较 `color` 和 `fruit` 时，编译器会查看它是否知道如何比较一个 `Color` 和一个 `Fruit` 。它不知道。接下来，它会尝试将 `Color` 和/或 `Fruit` 转换为整数，看看是否能找到匹配项。最终，编译器将确定如果它将两者都转换为整数，就可以进行比较。由于 `color` 和 `fruit` 都被设置为转换为整数值 `0` 的枚举， `color` 将等于 `fruit` 。

从语义上讲这是没有意义的，因为 `color` 和 `fruit` 来自不同的枚举，并且不打算进行比较。对于标准枚举来说，没有简单的方法来阻止这种情况。

由于存在这些挑战，以及命名空间污染问题（在全局作用域中定义的未命名枚举将其枚举器放入全局命名空间），C++的设计者认为需要一个更干净的解决方案来处理枚举。

### 带作用域的枚举

那个解决方案是作用域枚举（在 C++中通常称为 enum class，原因很快就会变得明显）。

作用域枚举的工作方式与无作用域枚举（[[#无作用域的枚举]]）类似，但有两个主要区别：它们不会隐式转换为整数，枚举器只被放置到枚举的作用域区域（而不是定义枚举的作用域区域）。

要创建一个作用域枚举，我们使用关键字 `class`。作用域枚举的其余定义与无作用域枚举的定义相同。这里有一个示例：
```cpp
#include <iostream>
int main()
{
    enum class Color // "enum class" defines this as a scoped enumeration rather than an unscoped enumeration
    {
        red, // red 属于 Color 的作用域
        blue,
    };

    enum class Fruit
    {
        banana, // banana 属于 Fruit 的作用域
        apple,
    };

    Color color { Color::red }; // 注意：red 不能直接访问，必须使用 Color::red
    Fruit fruit { Fruit::banana }; // 注意：banana 不能直接访问，必须使用 Fruit::banana

    if (color == fruit) // 编译错误：编译器不知道如何比较不同类型 Color 和 Fruit
        std::cout << "color and fruit are equal\n";
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

这个程序在行 19 处会产生编译错误，因为范围枚举无法转换为任何可以与其他类型进行比较的类型。

> [!CITE] 旁注
> `enum class` 关键字（以及 `enum` 关键字），是 C++ 语言中最常被重载的关键字之一，其含义会根据上下文不同而有所差异。尽管范围枚举使用了 `enum` 关键字，但它们不被视为“类类型”（该类型保留用于结构体、类和联合）。
> 
> `enum struct` 在此上下文中同样有效，并且行为与 `enum class` 完全相同。然而，使用 `enum struct` 非常不地道，因此应避免使用。

### 范围枚举定义自己的作用域区域

与无作用域的枚举不同，无作用域的枚举将其枚举器放置在枚举本身的作用域中，而作用域枚举则仅将其枚举器放置在枚举的作用域区域内。换句话说，作用域枚举对其枚举器起到了命名空间的作用。这种内置的命名空间有助于减少在全局作用域中使用作用域枚举时全局命名空间的污染和潜在的命名冲突。

要访问一个作用域枚举器，我们就像访问一个与作用域枚举名称相同的命名空间中的内容一样进行访问：
```cpp
#include <iostream>

int main()
{
    enum class Color // "enum class" defines this as a scoped enum rather than an unscoped enum
    {
        red, // red 属于 Color 的作用域
        blue,
    };

    std::cout << red << '\n';        // 编译错误：red 不在该作用域内
    std::cout << Color::red << '\n'; // 编译错误：std::cout 不知道如何输出该类型（不会隐式转为 int）

    Color color { Color::blue }; // 可以

    return 0;
}
```

由于范围枚举为枚举器提供了自己的隐式命名空间，因此无需将范围枚举放在另一个作用域区域（例如命名空间）中，除非有其他充分的理由这样做，因为这将是多余的。

### 作用域枚举不会隐式转换为整数

与无作用域的枚举器不同，作用域枚举器不会隐式转换为整数。在大多数情况下，这是好事，因为这样做很少有意义，而且有助于防止语义错误，例如比较来自不同枚举的枚举器，或表达式如 `red + 5` 。

请注意，您仍然可以比较同一作用域枚举（enum class）内的枚举器（因为它们是相同类型的）：
```cpp
#include <iostream>
int main()
{
    enum class Color
    {
        red,
        blue,
    };

    Color shirt { Color::red };

    if (shirt == Color::red) // 同类型的 Color 比较是允许的
        std::cout << "The shirt is red!\n";
    else if (shirt == Color::blue)
        std::cout << "The shirt is blue!\n";

    return 0;
}
```

在某些情况下，将范围枚举器视为整数值可能很有用。在这些情况下，你可以通过使用 `static_cast` 显式地将范围枚举器转换为整数。在 C++23 中更好的选择是使用 `std::to_underlying()` （定义在 `<utility>` 头文件中），它将枚举器转换为枚举的底层类型的值。
```cpp
#include <iostream>
#include <utility> // 用于 std::to_underlying()（C++23）

int main()
{
    enum class Color
    {
        red,
        blue,
    };

    Color color { Color::blue };

    std::cout << color << '\n'; // 不可行：没有隐式转换为 int
    std::cout << static_cast<int>(color) << '\n';   // 显式转为 int，会输出 1
    std::cout << std::to_underlying(color) << '\n'; // 转为底层类型，会输出 1（C++23）

    return 0;
}
```

相反，你也可以将一个整数赋值给一个作用域枚举器，这在从用户进行输入时非常有用：
```cpp
#include <iostream>

int main()
{
    enum class Pet
    {
        cat, // 分配为 0
        dog, // 分配为 1
        pig, // 分配为 2
        whale, // 分配为 3
    };

    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // 输入一个整数

    Pet pet{ static_cast<Pet>(input) }; // 将整数 static_cast 为 Pet

    return 0;
}
```

自 C++17 起，你可以使用整数值来列表初始化一个作用域枚举，无需 static_cast（与无作用域枚举不同，你不需要指定基类型）：
```cpp
// 使用上一个示例中的 enum class Pet
Pet pet { 1 }; // 可以
```

> [!SUCCESS] 最佳实践
> 优先使用作用域枚举而不是非作用域枚举，除非有充分的理由不这样做。

尽管作用域枚举提供了许多好处，但非作用域枚举在 C++中仍然被广泛使用，因为我们有时需要隐式转换为 int（频繁使用 static_cast 会很烦人），并且不需要额外的命名空间。

### 简化作用域枚举器转换为整数 ==advanced==

作用域枚举很棒，但缺少隐式转换为整数有时会成为一个痛点。如果我们经常需要将作用域枚举转换为整数（例如，在需要将作用域枚举器用作数组索引的情况下），每次转换时都必须使用 static_cast，这会显著使我们的代码变得杂乱。

如果你发现自己需要让范围枚举器转换为整数更加方便，一个有用的技巧是重载一元 `operator+` 运算符来执行这种转换：
```cpp
#include <iostream>
#include <type_traits> // 用于 std::underlying_type_t

enum class Animals
{
    chicken, // 0
    dog, // 1
    cat, // 2
    elephant, // 3
    duck, // 4
    snake, // 5

    maxAnimals,
};

// 重载一元 + 运算符，将枚举转换为底层类型
// 改编自 https://stackoverflow.com/a/42198760，感谢 Pixelchemist 的想法
// 在 C++23 中可 #include <utility> 并返回 std::to_underlying(a)
template <typename T>
constexpr auto operator+(T a) noexcept
{
    return static_cast<std::underlying_type_t<T>>(a);
}

int main()
{
    std::cout << +Animals::elephant << '\n'; // 用一元 + 将 Animals::elephant 转为整数

    return 0;
}
```

这段代码输出：
<pre>
3
</pre>

这个方法防止了意外地隐式转换为整型，但提供了一种方便的方式来按需显式请求这种转换。

### `using enum` 语句 ==C++20==

在 C++20 中引入的 `using enum` 语句将枚举中的所有枚举器导入当前作用域。当与枚举类类型一起使用时，这允许我们无需为每个枚举器添加枚举类的名称前缀即可访问枚举类枚举器。

这种情况在原本需要许多相同、重复的前缀时很有用，例如在 switch 语句中：
```cpp
#include <iostream>
#include <string_view>

enum class Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColor(Color color)
{
    using enum Color; // 将 Color 的所有枚举器引入当前作用域（C++20）
    // 现在可以不带 Color:: 前缀访问枚举器

    switch (color)
    {
    case black: return "black"; // 注意：这里是 black，而不是 Color::black
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt{ Color::blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```

在上述示例中， `Color` 是一个 enum class，因此我们通常需要使用完全限定的名称（例如 `Color::blue` ）来访问枚举器。然而，在函数 `getColor()` 中，我们添加了语句 `using enum Color;` ，这使我们能够无需 `Color::` 前缀来访问这些枚举器。

这使我们无需在 switch 语句中包含多个、冗余的、明显的前缀。

## 结构体、成员和成员选择简介

在编程中，我们经常需要使用多个变量来表示某个感兴趣的事物，一个分数有一个分子和一个分母，它们被链接成一个单一的数学对象。

或者，假设我们需要编写一个程序来存储公司员工的信息。我们可能需要跟踪员工的姓名、职位、年龄、员工 ID、经理 ID、工资、生日、雇佣日期等属性。

如果我们使用独立的变量来跟踪所有这些信息，可能会看起来像这样：
```cpp
std::string name;
std::string title;
int age;
int id;
int managerId;
double wage;
int birthdayYear;
int birthdayMonth;
int birthdayDay;
int hireYear;
int hireMonth;
int hireDay;
```

然而，这种方法存在一些问题。首先，这些变量是否实际相关并不立即明显（你需要阅读注释，或者查看它们在上下文中的使用方式）。其次，现在有 12 个变量需要管理。如果我们想把这名员工传递给一个函数，就必须传递 12 个参数（并且顺序正确），这将使我们的函数原型和函数调用变得混乱。而且由于一个函数只能返回一个值，函数又如何返回一个员工呢？

如果我们需要多个员工，我们还需要为每个额外员工定义 12 个更多变量（每个变量都需要一个唯一的名称）！这显然无法扩展。我们真正需要的是一种方法来组织所有这些相关的数据，使它们更容易管理。

幸运的是，C++ 提供了两种复合类型用于解决这类挑战：struct（我们即将介绍）和 class（我们很快会探讨）。struct（结构体的简称）是一种程序定义的数据类型（[[#程序定义（用户定义）类型的介绍]]），它允许我们将多个变量组合成一个类型。很快你就会看到，这使管理相关变量集变得简单得多！

> [!WARNING] REMINDER
> struct 是一种类类型（类和联合也是类类型）。因此，适用于类类型的任何内容都适用于 struct。

### 定义结构体

因为结构体是一种程序定义的类型，我们在使用它之前必须先告诉编译器我们的 struct 类型看起来像什么。这里是一个简化员工信息的结构体定义示例：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

`struct` 关键字用于告诉编译器我们正在定义一个名为 `Employee` 的结构体（因为程序定义的类型通常以大写字母开头）。

然后，在一对花括号内，我们定义每个 Employee 对象将包含的变量。在这个例子中，我们创建的每个 `Employee` 将会有 3 个变量：一个 `int id` ，一个 `int age` ，和一个 `double wage` 。属于结构的变量称为<font color="#4dfe50">数据成员</font>(**data members**)（或<font color="#4dfe50">成员变量</font>(**member variables**)）。

> [!TIP] 提示
> 在日常语言中，成员是指属于一个群体中的个体。例如，你可能是篮球队的一员，而你的姐姐可能是合唱团的一员。
> 
> 在 C++中，<font color="#4dfe50">成员</font>(**member**)是指属于结构体（或类）的变量、函数或类型。所有成员都必须在结构体（或类）的定义中声明。
> 
> 在未来的课程中，我们会频繁使用“成员”这个词，所以请确保你记住它的含义。

就像我们使用空的一对花括号来值初始化普通变量一样，每个成员变量后的空花括号确保当创建一个 `Employee` 时，我们的 `Employee` 内部的成员变量被值初始化。我们将在几节课后讲解默认成员初始化时再详细讨论这一点。

最后，我们在类型定义的末尾加上分号。

作为提醒， `Employee` 只是一个类型定义——此时实际上并未创建任何对象。

### 定义结构体对象

为了使用 `Employee` 类型，我们只需定义一个 `Employee` 类型的变量：
```cpp
Employee joe {}; // Employee 是类型，joe 是变量名
```

这定义了一个名为 `joe` 的 `Employee` 类型变量。当代码执行时，会实例化一个包含 3 个数据成员的 Employee 对象。空括号确保我们的对象进行了值初始化。

和任何其他类型一样，可以定义多个相同结构体的变量：
```cpp
Employee joe {}; // 为 Joe 创建一个 Employee 结构体对象
Employee frank {}; // 为 Frank 创建一个 Employee 结构体对象
```

### 访问成员

考虑以下示例：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe {};

    return 0;
}
```

在上述示例中，名称 `joe` 指的是整个结构体对象（其中包含成员变量）。要访问特定的成员变量，我们使用成员选择运算符（ `operator.` ），在结构体变量名和成员名之间。例如，要访问 Joe 的年龄成员，我们会使用 `joe.age` 。

结构体成员变量和普通变量一样工作，因此可以对它们进行常规操作，包括赋值、算术运算、比较等
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe {};

    joe.age = 32;  // 使用成员选择运算符（.）访问 joe 的 age 成员

    std::cout << joe.age << '\n'; // 输出 joe 的年龄

    return 0;
}
```

这段代码输出：
<pre>
32
</pre>

结构体最大的优势之一是我们只需要为每个结构体变量创建一个新名称（成员名称作为结构体类型定义的一部分是固定的）。在以下示例中，我们实例化了两个 `Employee` 对象： `joe` 和 `frank` 。
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe {};
    joe.id = 14;
    joe.age = 32;
    joe.wage = 60000.0;

    Employee frank {};
    frank.id = 15;
    frank.age = 28;
    frank.wage = 45000.0;

    int totalAge { joe.age + frank.age };
    std::cout << "Joe and Frank have lived " << totalAge << " total years\n";

    if (joe.wage > frank.wage)
        std::cout << "Joe makes more than Frank\n";
    else if (joe.wage < frank.wage)
        std::cout << "Joe makes less than Frank\n";
    else
        std::cout << "Joe and Frank make the same amount\n";

    // Frank 得到晋升
    frank.wage += 5000.0;

    // 今天是 Joe 的生日
    ++joe.age; // 使用前置自增将 Joe 的年龄加 1

    return 0;
}
```

在上面的例子中，很容易分辨出哪些成员变量属于 Joe，哪些属于 Frank。这比单独的变量提供了更高的组织水平。此外，由于 Joe 和 Frank 的成员具有相同的名称，当您有多个相同结构类型的变量时，这提供了一致性。

我们将在下一节继续探索结构体。

## 结构体聚合初始化

在上一节（[[#结构体、成员和成员选择简介]]）中，我们讨论了如何定义结构体、实例化结构体对象以及访问它们的成员。在本课中，我们将讨论结构体的初始化方式。

### 数据成员默认不初始化

与普通变量类似，数据成员默认不进行初始化。考虑以下结构体：
```cpp
#include <iostream>

struct Employee
{
    int id; // 注意：这里没有初始化器
    int age;
    double wage;
};

int main()
{
    Employee joe; // 注意：这里也没有初始化器
    std::cout << joe.id << '\n';

    return 0;
}
```

因为我们没有提供任何初始化器，当 `joe` 被实例化时， `joe.id` 、 `joe.age` 和 `joe.wage` 都将是未初始化的。当我们尝试打印 `joe.id` 的值时，就会得到未定义行为。

然而，在我们展示如何初始化一个结构体之前，让我们先短暂地偏离一下主题。

### 什么是聚合类型(aggregate)

在一般编程中，聚合数据类型（也称为聚合）是指任何可以包含多个数据成员的类型。某些聚合类型允许成员具有不同的类型（例如 structs），而其他类型则要求所有成员必须具有单一类型（例如数组）。

在 C++中，聚合的定义更加狭窄，而且相当复杂。

> [!CITE] 作者注
> 在这个系列中，当我们使用“聚合”（或“非聚合”）这个术语时，我们将指的是 C++中聚合的定义。

> [!CITE] 对于高级读者
> 简单来说，C++中的聚合要么是 C 风格数组，要么是一个类类型（struct、class 或 union），它具有：
> - 没有用户声明的构造函数
> - 没有私有或受保护的静态非数据成员
> - 没有虚函数
>   
> 流行的类型 `std::array` 也是一个聚合。
> 你可以在[这里](https://en.cppreference.com/w/cpp/language/aggregate_initialization.html)找到 C++聚合的精确定义。

此时需要理解的关键是，只有数据成员的结构体是聚合体。

### 结构体的聚合初始化

因为一个普通变量只能存储一个值，所以我们只需要提供一个初始化器：
```cpp
int x { 5 };
```

然而，结构体可以有多个成员：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

当我们定义一个结构体类型的对象时，我们需要某种方式在初始化时初始化多个成员：
```cpp
Employee joe; // 如何初始化 joe.id、joe.age 和 joe.wage？
```

聚合使用一种称为<font color="#4dfe50">聚合初始化</font>(**aggregate initialization**)的初始化形式，这允许我们直接初始化聚合的成员。为此，我们提供一个<font color="#4dfe50">初始化列表</font>(**initializer list**)作为初始化器，它只是一个由逗号分隔的值的括号列表。

聚合初始化主要有两种形式：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee frank = { 1, 32, 60000.0 }; // 使用花括号的拷贝列表初始化
    Employee joe { 2, 28, 45000.0 };     // 使用花括号的列表初始化（推荐）

    return 0;
}
```

这些初始化形式都执行成员初始化，这意味着结构体中的每个成员按照声明顺序进行初始化。因此， `Employee joe { 2, 28, 45000.0 };` 首先使用值 `2` 初始化 `joe.id` ，然后使用值 `28` 初始化 `joe.age` ，最后使用值 `45000.0` 初始化 `joe.wage` 。

> [!SUCCESS] 最佳实践
> 在初始化聚合类型时，优先使用（非拷贝）花括号列表形式。

在 C++20 中，我们也可以使用括号内的值列表来初始化（某些）聚合：
```cpp
Employee robert ( 3, 45, 62500.0 );  // 使用括号列表的直接初始化（C++20）
```

我们建议尽可能避免使用这种最后的形式，因为它目前无法与使用大括号省略的聚合类型（特别是 `std::array` ）一起工作。

### 初始化列表中缺少初始化器

如果一个聚合被初始化，但初始化值的数量少于成员的数量，那么没有显式初始化器的每个成员将按以下方式初始化：
- 如果成员有默认成员初始化器，则使用它。
- 否则，该成员会从空的初始化列表进行拷贝初始化。在大多数情况下，这将对那些成员执行值初始化（对于类类型，即使存在列表构造函数，这也将调用默认构造函数）。

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage { 76000.0 };
    double whatever;
};

int main()
{
    Employee joe { 2, 28 }; // joe.whatever 会被值初始化为 0.0

    return 0;
}
```

在上述示例中， `joe.id` 将使用 `2` 的值进行初始化，而 `joe.age` 将使用 `28` 的值进行初始化。因为 `joe.wage` 没有被赋予显式的初始化器，但它具有默认成员初始化器，所以 `joe.wage` 将被初始化为 `76000.0` 。最后，因为 `joe.whatever` 没有被赋予显式的初始化器， `joe.whatever` 将被值初始化为 `0.0` 。

### 重载 `operator<<` 以打印结构体

在 [[#I/O 运算符重载简介]] 中，我们展示了如何重载 `operator<<` 来打印枚举。为结构体重载 `operator<<` 也非常有用。

这是上一节中的相同示例，现在带有重载的 `operator<<` ：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

std::ostream& operator<<(std::ostream& out, const Employee& e)
{
    out << e.id << ' ' << e.age << ' ' << e.wage;
    return out;
}

int main()
{
    Employee joe { 2, 28 }; // joe.wage 会被值初始化为 0.0
    std::cout << joe << '\n';

    return 0;
}
```

这段代码输出：
<pre>
2 28 0
</pre>

我们可以看到 `joe.wage` 确实被值初始化为 `0.0` （它打印为 `0` ）。

与枚举不同，结构体可以包含多个值。如何格式化输出（例如，以分隔这些值）完全取决于你。

我们上面重载的 `operator<<` 输出的三个值并不直观，因为没有指示这些值代表什么。让我们用相同的例子，但更新我们的输出函数，使其更具描述性：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

std::ostream& operator<<(std::ostream& out, const Employee& e)
{
    out << "id: " << e.id << " age: " << e.age << " wage: " << e.wage;
    return out;
}

int main()
{
    Employee joe { 2, 28 }; // joe.wage 会被值初始化为 0.0
    std::cout << joe << '\n';

    return 0;
}
```

这现在会打印：
<pre>
id: 2 age: 28 wage: 0
</pre>

这稍微容易理解一些。

### 常量结构体

结构体类型的变量可以是 const（或 constexpr），就像所有 const 变量一样，它们必须被初始化。
```cpp
struct Rectangle
{
    double length {};
    double width {};
};

int main()
{
    const Rectangle unit { 1.0, 1.0 };
    const Rectangle zero { }; // 值初始化所有成员

    return 0;
}
```

### 指定初始化器 ==C++20==

当从一个值列表初始化结构体时，初始化器会按照声明的顺序应用于成员。
```cpp
struct Foo
{
    int a {};
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // f.a = 1，f.c = 3

    return 0;
}
```

现在考虑一下，如果你要更新这个结构体定义，添加一个不是最后一个成员的新成员，会发生什么：
```cpp
struct Foo
{
    int a {};
    int b {}; // 刚新增
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // 现在 f.a = 1，f.b = 3，f.c = 0

    return 0;
}
```

现在所有的初始化值都发生了偏移，更糟糕的是，编译器可能不会将其检测为错误（毕竟，语法仍然是有效的）。

为了帮助避免这种情况，C++20 引入了一种新的结构成员初始化方法，称为指定初始化器。指定初始化器允许你明确定义哪些初始化值映射到哪些成员。成员可以使用列表初始化或拷贝初始化，并且必须在结构体中声明的顺序中按相同顺序进行初始化，否则将产生警告或错误。未指定初始化器的成员将被值初始化。
```cpp
struct Foo
{
    int a{ };
    int b{ };
    int c{ };
};

int main()
{
    Foo f1{ .a{ 1 }, .c{ 3 } }; // 可以：f1.a = 1，f1.b = 0（值初始化），f1.c = 3
    Foo f2{ .a = 1, .c = 3 };   // 可以：f2.a = 1，f2.b = 0（值初始化），f2.c = 3
    Foo f3{ .b{ 2 }, .a{ 1 } }; // 错误：初始化顺序与成员声明顺序不一致

    return 0;
}
```

指定初始化器很方便，因为它们提供了一定程度的自我文档化，并有助于确保你不会无意中弄错初始化值的顺序。然而，指定初始化器也会显著增加初始化列表的杂乱，因此在此刻我们不建议将其作为最佳实践使用。

此外，由于没有强制规定在聚合类型初始化的每个地方都使用指定初始化器，因此避免在现有聚合定义的中间添加新成员是一个好主意，以避免初始化器偏移的风险。

> [!SUCCESS] 最佳实践
> 当向聚合添加新成员时，最安全的方法是将其添加到定义列表的底部，这样其他成员的初始化器就不会发生偏移。

### 使用初始化列表的赋值

如前一节所示，我们可以单独为结构体的成员赋值：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };

    joe.age  = 33;      // Joe 过生日了
    joe.wage = 66000.0; // 还加薪了

    return 0;
}
```

这对于单个成员来说还可以，但当我们想更新多个成员时就不太好了。类似于使用初始化列表初始化结构体，你也可以使用初始化列表为结构体赋值（它进行成员逐个赋值）：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };
    joe = { joe.id, 33, 66000.0 }; // Joe 过生日并加薪

    return 0;
}
```

请注意，因为我们不想改变 `joe.id` ，我们需要在我们的列表中提供一个当前值作为占位符，以便成员赋值可以将 `joe.id` 赋给 `joe.id` 。这有点不美观。

### 使用指定初始化器的赋值 ==C++20==

设计指定初始化器也可以用于列表赋值：
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };
    joe = { .id = joe.id, .age = 33, .wage = 66000.0 }; // Joe 过生日并加薪

    return 0;
}
```

在这样的一次赋值中，任何未指定成员将被赋予用于值初始化的值。如果我们没有为 `joe.id` 指定一个指定初始化器， `joe.id` 将被赋予值 0。

### 使用相同类型的另一个结构体初始化结构体

结构体也可以使用相同类型的另一个结构体进行初始化：
```cpp
#include <iostream>

struct Foo
{
    int a{};
    int b{};
    int c{};
};

std::ostream& operator<<(std::ostream& out, const Foo& f)
{
    out << f.a << ' ' << f.b << ' ' << f.c;
    return out;
}

int main()
{
    Foo foo { 1, 2, 3 };

    Foo x = foo; // 拷贝初始化
    Foo y(foo);  // 直接初始化
    Foo z {foo}; // 直接列表初始化

    std::cout << x << '\n';
    std::cout << y << '\n';
    std::cout << z << '\n';

    return 0;
}
```

以上输出：
<pre>
1 2 3
1 2 3
1 2 3
</pre>
请注意，这里使用的是我们熟悉的初始化标准形式（拷贝初始化、直接初始化或直接列表初始化），而不是聚合初始化。

这通常在用返回相同类型结构的函数的返回值来初始化结构时看到。我们将在 [[Todo]] 传递和返回结构中更详细地讨论这一点。

## 默认成员初始化

当我们定义一个 struct（或 class）类型时，可以在类型定义中为每个成员提供一个默认初始化值。对于未标记为 `static` 的成员，这个过程有时被称为<font color="#4dfe50">非静态成员初始化</font>(**non-static member initialization**)。初始化值称为<font color="#4dfe50">默认成员初始化器</font>(**default member initializer**)。

这里有一个例子：
```cpp
struct Something
{
    int x;       // 没有初始化值（不推荐）
    int y {};    // 默认值初始化
    int z { 2 }; // 显式默认值
};

int main()
{
    Something s1; // s1.x 未初始化，s1.y 为 0，s1.z 为 2

    return 0;
}
```

在上述 `Something` 定义中， `x` 没有默认值， `y` 默认进行值初始化，而 `z` 具有默认值 `2` 。如果用户在实例化类型为 `Something` 的对象时没有提供显式的初始化值，这些默认成员初始化值将被使用。

我们的 `s1` 对象没有初始化器，因此 `s1` 的成员被初始化为它们的默认值。 `s1.x` 没有默认初始化器，所以它保持未初始化。 `s1.y` 默认进行值初始化，因此它获得值 `0` 。而 `s1.z` 被初始化为值 `2` 。

请注意，即使我们没有为 `s1.z` 提供显式的初始化器，它也会被初始化为一个非零值，因为提供了默认成员初始化器。

### 显式初始化值优先于默认值

列表初始化器中的显式值总是优先于默认成员初始化值。
```cpp
struct Something
{
    int x;       // 没有默认初始化值（不推荐）
    int y {};    // 默认值初始化
    int z { 2 }; // 显式默认值
};

int main()
{
    Something s2 { 5, 6, 7 }; // 使用显式初始化值（不会用默认值）

    return 0;
}
```

在上面的例子中， `s2` 对每个成员都有显式初始化值，所以根本没有使用默认成员初始化值。这意味着 `s2.x` 、 `s2.y` 和 `s2.z` 分别被初始化为 `5` 、 `6` 和 `7` 的值。

### 当存在默认值时，初始化列表中缺失的初始化器

在上一节（[[#结构体聚合初始化]]）中，我们提到如果聚合被初始化，但初始化值的数量少于成员数量，那么所有剩余的成员将被值初始化。然而，如果为某个成员提供了默认成员初始化器，那么将使用该默认成员初始化器。
```cpp
struct Something
{
    int x;       // 没有默认初始化值（不推荐）
    int y {};    // 默认值初始化
    int z { 2 }; // 显式默认值
};

int main()
{
    Something s3 {}; // s3.x 值初始化，s3.y 与 s3.z 使用默认值

    return 0;
}
```

在上述情况下， `s3` 是用空列表进行列表初始化的，因此所有初始化器都缺失。这意味着如果存在默认成员初始化器，将使用它；否则将发生值初始化。因此， `s3.x` （没有默认成员初始化器）被值初始化为 `0` ， `s3.y` 默认值初始化为 `0` ，而 `s3.z` 默认为值 `2` 。

### 回顾初始化的可能性

如果一个聚合类型使用初始化列表定义：
- 如果存在显式初始化值，则使用该显式值。
- 如果缺少初始化器且存在默认成员初始化器，则使用默认值。
- 如果缺少初始化器且不存在默认成员初始化器，则进行值初始化。

如果聚合类型未使用初始化列表定义：
- 如果存在默认成员初始化器，则使用默认值。
- 如果没有默认成员初始化器，该成员将保持未初始化状态。

成员总是按照声明顺序进行初始化。

以下示例涵盖了所有可能性：
```cpp
struct Something
{
    int x;       // 没有默认初始化值（不推荐）
    int y {};    // 默认值初始化
    int z { 2 }; // 显式默认值
};

int main()
{
    Something s1;             // 无初始化列表：s1.x 未初始化，s1.y 与 s1.z 使用默认值
    Something s2 { 5, 6, 7 }; // 显式初始化：s2.x、s2.y、s2.z 使用显式值（不使用默认值）
    Something s3 {};          // 缺少初始化器：s3.x 值初始化，s3.y 与 s3.z 使用默认值

    return 0;
}
```

我们需要注意的情况是 `s1.x` 。因为 `s1` 没有初始化列表，而 `x` 没有默认成员初始化器，所以 `s1.x` 保持未初始化（这是不好的，因为我们应该始终初始化我们的变量）。

### 始终为你的成员提供默认值

为了避免未初始化成员的可能性，只需确保每个成员都有一个默认值（无论是显式的默认值，还是空的一对大括号）。这样，无论我们是否提供初始化列表，我们的成员都会被初始化为某个值。

考虑以下结构体，其中所有成员都已默认初始化：
```cpp
struct Fraction
{
    int numerator { }; // 这里应使用 { 0 }，但示例中先用值初始化
	int denominator { 1 };
};

int main()
{
    Fraction f1;          // f1.numerator 值初始化为 0，f1.denominator 默认值为 1
    Fraction f2 {};       // f2.numerator 值初始化为 0，f2.denominator 默认值为 1
    Fraction f3 { 6 };    // f3.numerator 初始化为 6，f3.denominator 默认值为 1
    Fraction f4 { 5, 8 }; // f4.numerator 初始化为 5，f4.denominator 初始化为 8

	return 0;
}
```

在任何情况下，我们的成员都会被初始化为值。

> [!SUCCESS] 最佳实践
> 为所有成员提供一个默认值。这确保了即使变量定义不包含初始化列表，你的成员也会被初始化。

### 默认初始化与聚合类型的值初始化

回顾上述示例中的两行代码：
```cpp
Fraction f1;          // f1.numerator 值初始化为 0，f1.denominator 默认值为 1
Fraction f2 {};       // f2.numerator 值初始化为 0，f2.denominator 默认值为 1
```

你会注意到 `f1` 是默认初始化的，而 `f2` 是值初始化的，但结果相同（ `numerator` 被初始化为 `0` ， `denominator` 被初始化为 `1` ）。那么我们应该选择哪种方式呢？

值初始化的情况（ `f2` ）更安全，因为它会确保任何没有默认值的成员都被值初始化（尽管我们应该总是为成员提供默认值，但这可以防止遗漏的情况）。

选择值初始化还有一个好处——它与我们初始化其他类型的对象的方式一致。一致性有助于防止错误。

> [!SUCCESS] 最佳实践
> 对于聚合类型，优先使用值初始化（使用空括号初始化器）而不是默认初始化（不使用括号）。

## 传递和返回结构体

考虑一个由 3 个松散变量表示的员工：
```cpp
int main()
{
    int id { 1 };
    int age { 24 };
    double wage { 52400.0 };

    return 0;
}
```

如果我们想将这个员工传递给一个函数，我们必须传递三个变量：
```cpp
#include <iostream>

void printEmployee(int id, int age, double wage)
{
    std::cout << "ID:   " << id << '\n';
    std::cout << "Age:  " << age << '\n';
    std::cout << "Wage: " << wage << '\n';
}

int main()
{
    int id { 1 };
    int age { 24 };
    double wage { 52400.0 };

    printEmployee(id, age, wage);

    return 0;
}
```

虽然传递 3 个单独的员工变量并不是什么大问题，但考虑一个需要传递 10 个或 12 个员工变量的函数。独立传递每个变量既耗时又容易出错。此外，如果我们给员工添加了一个新属性（例如姓名），我们现在必须修改所有函数的声明、定义和函数调用，以接受新的参数和实参！

### 传递结构体（通过引用）

使用结构体而不是单个变量的一大优势是我们可以将整个结构体传递给需要处理其成员的函数。结构体通常通过引用（通常是常量引用）传递，以避免进行复制。
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

void printEmployee(const Employee& employee) // 注意：这里按引用传递
{
    std::cout << "ID:   " << employee.id << '\n';
    std::cout << "Age:  " << employee.age << '\n';
    std::cout << "Wage: " << employee.wage << '\n';
}

int main()
{
    Employee joe { 14, 32, 24.15 };
    Employee frank { 15, 28, 18.27 };

    // 打印 Joe 的信息
    printEmployee(joe);

    std::cout << '\n';

    // 打印 Frank 的信息
    printEmployee(frank);

    return 0;
}
```

在上述示例中，我们将整个 `Employee` 传递给 `printEmployee()` （两次，一次用于 `joe` ，一次用于 `frank` ）。

上述程序输出：
<pre>
ID:   14
Age:  32
Wage: 24.15

ID:   15
Age:  28
Wage: 18.27
</pre>

由于我们传递的是整个结构体对象（而不是各个成员），无论结构体对象有多少成员，我们只需要一个参数。而且，在未来，如果我们决定向 `Employee` 结构体添加新的成员，我们将无需更改函数声明或函数调用！新成员将自动包含在内。

### 传递临时结构体

在前面的例子中，我们在将其传递给 `printEmployee()` 函数之前创建了 Employee 变量 `joe` 。这允许我们给 Employee 变量命名，这在文档编制方面很有用。但它也需要两个语句（一个用于创建 `joe` ，一个用于使用 `joe` ）。

在只需要使用一次变量的情况下，必须给变量命名并分离变量的创建和使用，这可能会增加复杂性。在这种情况下，使用临时对象可能更可取。临时对象不是变量，因此它没有标识符。

这里是与上面相同的示例，但我们用临时对象替换了变量 `joe` 和 `frank` ：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

void printEmployee(const Employee& employee) // 注意：这里按引用传递
{
    std::cout << "ID:   " << employee.id << '\n';
    std::cout << "Age:  " << employee.age << '\n';
    std::cout << "Wage: " << employee.wage << '\n';
}

int main()
{
    // 打印 Joe 的信息
    printEmployee(Employee { 14, 32, 24.15 }); // 构造临时 Employee 传参（显式指定类型，更推荐）

    std::cout << '\n';

    // 打印 Frank 的信息
    printEmployee({ 15, 28, 18.27 }); // 构造临时 Employee 传参（类型由参数推导）

    return 0;
}
```

我们可以通过两种方式创建一个临时的 `Employee` 。在第一个调用中，我们使用 `Employee { 14, 32, 24.15 }` 的语法。这告诉编译器创建一个 `Employee` 对象，并用提供的初始化器对其进行初始化。这种语法是首选的，因为它清楚地表明了我们正在创建什么类型的临时对象，而且编译器没有误解我们意图的方式。

在第二次调用中，我们使用 `{ 15, 28, 18.27 }` 的语法。编译器足够智能，能够理解提供的参数必须转换为 `Employee` ，以便函数调用能够成功。请注意，这种形式被视为隐式转换，因此它不会在仅接受显式转换的情况下工作。

关于临时对象还有几点：它们在定义点创建并初始化，并在创建它们的完整表达式的末尾销毁。临时对象的求值是一个右值表达式，它只能用于接受右值的地方。当临时对象作为函数参数使用时，它只会绑定到接受右值的参数上。这包括按值传递和按 const 引用传递，不包括按非 const 引用传递和按地址传递。

### 返回结构体

考虑这样一种情况：我们需要一个函数来返回一个三维笛卡尔空间中的点。这样的点有 3 个属性：一个 x 坐标、一个 y 坐标和一个 z 坐标。但是函数只能返回一个值。那么我们如何将这 3 个坐标都返回给用户呢？

一种常见的方法是返回一个结构体：
```cpp
#include <iostream>

struct Point3d
{
    double x { 0.0 };
    double y { 0.0 };
    double z { 0.0 };
};

Point3d getZeroPoint()
{
    // 可以先创建变量再返回它（下面会改进）
    Point3d temp { 0.0, 0.0, 0.0 };
    return temp;
}

int main()
{
    Point3d zero{ getZeroPoint() };

    if (zero.x == 0.0 && zero.y == 0.0 && zero.z == 0.0)
        std::cout << "The point is zero\n";
    else
        std::cout << "The point is not zero\n";

    return 0;
}
```

这段代码输出：
<pre>
The point is zero
</pre>
函数内部定义的结构体通常按值返回，以免返回悬空引用。

在上述 `getZeroPoint()` 函数中，我们创建了一个新的命名对象（ `temp` ），只是为了返回它：
```cpp
Point3d getZeroPoint()
{
    // 可以先创建变量再返回它（下面会改进）
    Point3d temp { 0.0, 0.0, 0.0 };
    return temp;
}
```

对象的名字（ `temp` ）在这里并没有提供任何文档价值。

我们可以通过返回一个临时（无名/匿名）对象来使我们的函数稍微更好一些：
```cpp
Point3d getZeroPoint()
{
    return Point3d { 0.0, 0.0, 0.0 }; // 返回一个匿名 Point3d
}
```

在这种情况下，会构建一个临时 `Point3d` ，将其复制回调用者，然后在表达式结束时销毁。注意这种方法的简洁性（一行代码比两行更少，并且无需考虑 `temp` 是否被多次使用）。

### 推断返回类型

当函数有明确的返回类型（例如 `Point3d` ）时，我们甚至可以在返回语句中省略类型：
```cpp
Point3d getZeroPoint()
{
    // 函数声明已指定返回类型
    // 因此这里不需要重复指定类型
    return { 0.0, 0.0, 0.0 }; // 返回一个匿名 Point3d
}
```

这被认为是一种隐式转换。

此外，请注意，由于在这种情况下我们返回所有为零的值，因此可以使用空括号来返回一个值初始化的 Point3d：
```cpp
Point3d getZeroPoint()
{
    // 可以用空花括号对所有成员进行值初始化
    return {};
}
```


### 结构体是重要的构建模块

虽然结构体本身很有用，但类（C++和面向对象编程的核心）直接建立在我们在本节介绍的概念之上。对结构体（尤其是数据成员、成员选择和默认成员初始化）有深入理解，将使你过渡到类变得更加容易。

## 结构体杂项

### 具有程序定义成员的结构体

在 C++中，结构体（和类）可以包含其他程序定义类型的成员。有两种方法可以实现这一点。

首先，我们可以定义一个程序定义类型（在全局作用域中），然后将其作为另一个程序定义类型的成员使用：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

struct Company
{
    int numberOfEmployees {};
    Employee CEO {}; // Employee 是 Company 内的结构体成员
};

int main()
{
    Company myCompany{ 7, { 1, 32, 55000.0 } }; // 使用嵌套初始化列表初始化 Employee
    std::cout << myCompany.CEO.wage << '\n'; // 输出 CEO 的工资

    return 0;
}
```

在上面的例子中，我们定义了一个 `Employee` 结构体，然后将其作为 `Company` 结构体的成员。当我们初始化我们的 `Company` 时，我们也可以通过嵌套初始化列表来初始化我们的 `Employee` 。如果我们想知道 CEO 的薪水是多少，我们只需使用两次成员选择运算符： `myCompany.CEO.wage;`

其次，类型也可以嵌套在其他类型内部，所以如果 Employee 类型仅作为 Company 的一部分存在，那么 Employee 类型可以嵌套在 Company 结构体内部：
```cpp
#include <iostream>

struct Company
{
    struct Employee // 通过 Company::Employee 访问
    {
        int id{};
        int age{};
        double wage{};
    };

    int numberOfEmployees{};
    Employee CEO{}; // Employee 是 Company 内的结构体成员
};

int main()
{
    Company myCompany{ 7, { 1, 32, 55000.0 } }; // 使用嵌套初始化列表初始化 Employee
    std::cout << myCompany.CEO.wage << '\n'; // 输出 CEO 的工资

    return 0;
}
```

这更常用于类，所以我们将在未来更多地讨论这个内容。

### 拥有所有权的结构体应该具有拥有所有权的成员数据

我们在拥有者和查看者的双重概念中了解到：拥有者管理自己的数据，并控制其销毁时间。查看者查看他人的数据，并不控制其修改或销毁时间。

在大多数情况下，我们希望我们的结构体（和类）是它们所包含数据的所有者。这提供了一些有用的好处：
- 数据成员将一直有效，只要结构体（或类）有效。
- 这些数据成员的值不会意外改变。

使结构体（或类）成为所有者的最简单方法是给每个数据成员指定一个所有者类型的类型（例如，不是查看者、指针或引用）。如果一个结构体或类具有所有者类型的数据成员，那么该结构体或类本身就自动成为所有者。

如果一个结构体（或类）有一个数据成员是查看器，那么被该成员查看的对象可能会在查看它的数据成员之前被销毁。如果发生这种情况，结构体会留下一个悬空成员，访问该成员将导致未定义行为。

> [!SUCCESS] 最佳实践
> 在大多数情况下，我们希望我们的结构体（和类）是所有者。最简单的方法是确保每个数据成员都有一个所有者类型（例如，不是查看器、指针或引用）。

这就是为什么字符串数据成员几乎总是类型为 `std::string` （即拥有者），而不是类型为 `std::string_view` （即观察者）。以下示例说明了这种情况的重要性：
```cpp
#include <iostream>
#include <string>
#include <string_view>

struct Owner
{
    std::string name{}; // std::string 是所有者
};

struct Viewer
{
    std::string_view name {}; // std::string_view 是观察者
};

// getName() 将用户输入作为临时 std::string 返回
// 该临时 std::string 会在包含函数调用的完整表达式末尾被销毁
std::string getName()
{
    std::cout << "Enter a name: ";
    std::string name{};
    std::cin >> name;
    return name;
}

int main()
{
    Owner o { getName() };  // getName() 的返回值在初始化后立即销毁
    std::cout << "The owners name is " << o.name << '\n';  // 正常

    Viewer v { getName() }; // getName() 的返回值在初始化后立即销毁
    std::cout << "The viewers name is " << v.name << '\n'; // 未定义行为

    return 0;
}
```

`getName()` 函数将用户输入的名称作为临时 `std::string` 返回。这个临时返回值在函数被调用的完整表达式的末尾被销毁。

在 `o` 的情况下，这个临时 `std::string` 用于初始化 `o.name` 。由于 `o.name` 是一个 `std::string` ， `o.name` 只是临时 `std::string` 的视图，而不是副本。临时 `std::string` 随后消失，而 `o.name` 悬空。当我们打印 `o.name` 时，会得到未定义行为。

在 `v` 的情况下，这个临时 `std::string` 用于初始化 `v.name` 。由于 `v.name` 是一个 `std::string_view` ， `v.name` 只是临时 `std::string` 的视图，不是副本。临时 `std::string` 随后消失，留下 `v.name` 悬空。当我们打印 `v.name` 时，会得到未定义行为。

### 结构体大小和数据结构对齐

通常，结构体的大小是其所有成员大小的总和，但并不总是如此！

考虑以下程序：
```cpp
#include <iostream>

struct Foo
{
    short a {};
    int b {};
    double c {};
};

int main()
{
    std::cout << "The size of short is " << sizeof(short) << " bytes\n";
    std::cout << "The size of int is " << sizeof(int) << " bytes\n";
    std::cout << "The size of double is " << sizeof(double) << " bytes\n";

    std::cout << "The size of Foo is " << sizeof(Foo) << " bytes\n";

    return 0;
}
```

在作者机器上，它打印出了：
<pre>
The size of short is 2 bytes
The size of int is 4 bytes
The size of double is 8 bytes
The size of Foo is 16 bytes
</pre>
请注意， `short` + `int` + `double` 的大小是 14 字节，但 `Foo` 的大小是 16 字节！

事实证明，我们只能说结构的大小至少与它包含的所有变量的总大小一样。但它可能会更大！出于性能考虑，编译器有时会在结构中添加空隙（这被称为<font color="#4dfe50">填充</font>(**padding**)）。

在上面的 `Foo` 结构中，编译器在成员 `a` 之后隐式地添加了 2 字节的填充，使得结构的大小变为 16 字节而不是 14。

这实际上对结构体的大小有相当大的影响，以下程序演示了这一点：
```cpp
#include <iostream>

struct Foo1
{
    short a{}; // a 后面会有 2 字节填充
    int b{};
    short c{}; // c 后面会有 2 字节填充
};

struct Foo2
{
    int b{};
    short a{};
    short c{};
};

int main()
{
    std::cout << sizeof(Foo1) << '\n'; // 输出 12
    std::cout << sizeof(Foo2) << '\n'; // 输出 8

    return 0;
}
```

该程序输出：
<pre>
12
8
</pre>
注意 `Foo1` 和 `Foo2` 的成员相同，唯一的不同在于声明顺序。然而 `Foo1` 因为增加了填充，大小是前者的 50%。

> [!TIP] 提示
> 你可以通过按成员大小递减的顺序定义来最小化填充。
> 
> C++ 编译器不允许重新排序成员，因此这必须手动完成。

## 通过指针和引用选择成员

### 结构体和结构体引用的成员选择

在[[#结构体、成员和成员选择简介]] 中，我们展示了你可以使用成员选择运算符（.）从结构体对象中选择一个成员：
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 34, 65000.0 };

    // 使用成员选择运算符（.）从结构体对象中选择成员
    ++joe.age; // Joe 过生日了
    joe.wage = 68000.0; // Joe 得到晋升

    return 0;
}
```

由于对对象引用的作用与对象本身相同，我们也可以使用成员选择运算符（.）从结构体引用中选择一个成员：
```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

void printEmployee(const Employee& e)
{
    // 使用成员选择运算符（.）从结构体引用中选择成员
    std::cout << "Id: " << e.id << '\n';
    std::cout << "Age: " << e.age << '\n';
    std::cout << "Wage: " << e.wage << '\n';
}

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    printEmployee(joe);

    return 0;
}
```

### 指向结构体的指针的成员选择

然而，成员选择运算符（.）不能直接用于指向结构的指针：
```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << ptr.id << '\n'; // 编译错误：指针不能使用 operator.

    return 0;
}
```

对于普通变量或引用，我们可以直接访问对象。但是，因为指针存储地址，我们需要先解引用指针才能获取对象，然后才能对其进行操作。因此，从指向结构的指针访问成员的一种方法如下：
```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << (*ptr).id << '\n'; // 不优雅但可行：先解引用，再选成员

    return 0;
}
```

然而，这有点丑，特别是因为我们需要用括号括起解引用操作，以便它优先于成员选择操作。

为了使语法更简洁，C++ 提供了成员选择<font color="#4dfe50">指针运算符</font>(**member selection from pointer operator**)（->）（有时也称为<font color="#4dfe50">箭头运算符</font>(**arrow operator**)），可用于从对象的指针中选择成员：
```cpp
#include <iostream>

struct Employee
{
    int id{};
    int age{};
    double wage{};
};

int main()
{
    Employee joe{ 1, 34, 65000.0 };

    ++joe.age;
    joe.wage = 68000.0;

    Employee* ptr{ &joe };
    std::cout << ptr->id << '\n'; // 更好：用 -> 从指针访问成员

    return 0;
}
```

这个通过指针运算符（->）的成员选择与通过成员选择运算符（.）的选择工作方式完全相同，但在选择成员之前会隐式地解除指针对象的引用。因此 `ptr->id` 等同于 `(*ptr).id` 。

这个箭头操作符不仅更容易输入，而且由于间接引用是隐式完成的，因此它大大减少了错误的可能性，所以无需担心运算符优先级问题。因此，在通过指针访问成员时，始终使用 -> 操作符而不是 . 操作符。

> [!SUCCESS] 最佳实践
> 当使用指针访问成员时，应使用指针运算符（->）而不是成员选择运算符（.）。

### 链式 `->` 操作符

如果通过 `operator->` 访问的成员是指向类类型的指针，可以在同一表达式中再次应用 `operator->` 来访问该类类型的成员。

以下示例说明这一点：
```cpp
#include <iostream>

struct Point
{
    double x {};
    double y {};
};

struct Triangle
{
    Point* a {};
    Point* b {};
    Point* c {};
};

int main()
{
    Point a {1,2};
    Point b {3,7};
    Point c {10,2};

    Triangle tr { &a, &b, &c };
    Triangle* ptr {&tr};

    // ptr 指向 Triangle，Triangle 的成员是指向 Point 的指针
    // 访问 ptr 指向的 Triangle 的 c 的 y 成员，可用以下等价写法：

    // 使用 operator.
    std::cout << (*(*ptr).c).y << '\n'; // 很丑！

    // 使用 operator->
    std::cout << ptr -> c -> y << '\n'; // 清爽多了
}
```

当在序列中使用多个 `operator->` （例如 `ptr->c->y` ）时，表达式可能难以阅读。在成员和 `operator->` 之间添加空格（例如 `ptr -> c -> y` ）可以使操作符访问的成员更容易区分。

### 混合指针和非指针成员

成员选择运算符始终应用于当前选定的变量。如果你有指针和普通成员变量的混合，你可以看到同时使用 . 和 -> 连续进行的成员选择：
```cpp
#include <iostream>
#include <string>

struct Paw
{
    int claws{};
};

struct Animal
{
    std::string name{};
    Paw paw{};
};

int main()
{
    Animal puma{ "Puma", { 5 } };

    Animal* ptr{ &puma };

    // ptr 是指针，用 ->
    // paw 不是指针，用 .

    std::cout << (ptr->paw).claws << '\n';

    return 0;
}
```

请注意，在 `(ptr->paw).claws` 的情况下，由于 `operator->` 和 `operator.` 都是从左到右求值，因此不需要括号，但括号会稍微提高可读性。

## 类模板

### 聚合类型面临的挑战

我们处理聚合类型（包括结构体、类、联合体和数组）时也会遇到和函数相似的挑战。

例如，假设我们需要编写一个程序来处理 `int` 值对，并需要确定两个数中哪个更大。我们可能会编写如下程序：
```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

constexpr int max(Pair p) // Pair 很小，按值传递即可
{
    return (p.first < p.second ? p.second : p.first);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    return 0;
}
```

后来我们发现我们还需要 `double` 值的对。因此我们将程序更新为以下内容：
```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

struct Pair // 编译错误：Pair 被重复定义
{
    double first{};
    double second{};
};

constexpr int max(Pair p)
{
    return (p.first < p.second ? p.second : p.first);
}

constexpr double max(Pair p) // 编译错误：重载仅在返回类型不同
{
    return (p.first < p.second ? p.second : p.first);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    Pair p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n";

    return 0;
}
```

不幸的是，这个程序无法编译，并且存在一些需要解决的问题。

首先，与函数不同，类型定义不能重载。编译器会将 `Pair` 的第二个定义视为对 `Pair` 第一个定义的错误重声明。其次，尽管函数可以重载，但我们的 `max(Pair)` 函数仅通过返回类型不同，而重载函数不能仅通过返回类型来区分。第三，这里有很多冗余。每个 `Pair` 结构体都相同（除了数据类型），我们的 `max(Pair)` 函数也相同（除了返回类型）。

我们可以通过给我们的 `Pair` 结构体不同的名称（例如 `PairInt` 和 `PairDouble` ）来解决前两个问题。但那样的话，我们都需要记住我们的命名方案，并且本质上是为每个我们想要添加的额外类型对克隆大量代码，这并没有解决冗余问题。

幸运的是，我们可以做得更好。

### 类模板

就像函数模板是用于实例化函数的模板定义一样，类模板是用于实例化类类型的模板定义。

> [!WARNING] 提醒
> 一个“类类型”是结构体、类或联合类型。虽然我们将以结构体为例来演示“类模板”，但这里的内容同样适用于类。

作为提醒，以下是我们的 `int` 对应的结构体定义：
```cpp
struct Pair
{
    int first{};
    int second{};
};
```

让我们将我们的 pair 类改写为一个类模板：
```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // 实例化 Pair<int> 并创建对象 p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // 实例化 Pair<double> 并创建对象 p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // 使用已实例化的 Pair<double> 定义创建对象 p3
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

和函数模板一样，我们以模板参数声明开始类模板定义。我们以 `template` 关键字开始。接下来，我们在尖括号（<>）中指定类模板将使用的所有模板类型。对于每个需要的模板类型，我们使用关键字 `typename` （推荐）或 `class` （不推荐），然后跟上模板类型的名称（例如 `T` ）。在这种情况下，由于我们的两个成员都是相同类型，我们只需要一个模板类型。

接下来，我们像往常一样定义我们的结构体，只不过我们可以在任何需要模板类型的地方使用我们的模板类型（ `T` ），稍后它将被一个实际类型替换。就这样！类模板的定义完成了。

在 main 函数中，我们可以使用任何我们想要的类型来实例化 `Pair` 对象。首先，我们实例化一个类型为 `Pair<int>` 的对象。因为 `Pair<int>` 的类型定义还不存在，编译器使用类模板来实例化一个名为 `Pair<int>` 的结构类型定义，其中所有模板类型 `T` 的实例都被类型 `int` 替换。

接下来，我们实例化一个类型为 `Pair<double>` 的对象，该对象实例化一个名为 `Pair<double>` 的结构类型定义，其中 `T` 被替换为 `double` 。对于 `p3` ， `Pair<double>` 已经实例化，因此编译器将使用先前的类型定义。

以下是上述相同示例，展示了在所有模板实例化完成后，编译器实际编译的内容：
```cpp
#include <iostream>

// Pair 类模板的声明
// (we don't need the definition any more since it's not used)
template <typename T>
struct Pair;

// 显式定义 Pair<int> 的样子
template <> // 告诉编译器这是没有模板参数的模板特化
struct Pair<int>
{
    int first{};
    int second{};
};

// 显式定义 Pair<double> 的样子
template <> // 告诉编译器这是没有模板参数的模板特化
struct Pair<double>
{
    double first{};
    double second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // 实例化 Pair<int> 并创建对象 p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // 实例化 Pair<double> 并创建对象 p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // 使用已实例化的 Pair<double> 定义创建对象 p3
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

你可以直接编译这个示例，并看到它按预期工作！

### 在函数中使用我们的类模板

现在让我们回到如何让我们的 `max()` 函数支持不同类型的挑战。由于编译器将 `Pair<int>` 和 `Pair<double>` 视为不同的类型，我们可以使用参数类型不同的重载函数：
```cpp
constexpr int max(Pair<int> p)
{
    return (p.first < p.second ? p.second : p.first);
}

constexpr double max(Pair<double> p) // 可以：重载由参数类型区分
{
    return (p.first < p.second ? p.second : p.first);
}
```

虽然这段代码可以编译，但它并没有解决冗余问题。我们真正想要的是一个可以接受任意类型对的函数。换句话说，我们想要一个接受类型为 `Pair<T>` 的参数的函数，其中 T 是一个模板类型参数。这意味着我们需要一个函数模板来完成这项工作！

这里是一个完整示例，其中 `max()` 作为函数模板实现：
```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first < p.second ? p.second : p.first);
}

int main()
{
    Pair<int> p1{ 5, 6 };
    std::cout << max<int>(p1) << " is larger\n"; // 显式调用 max<int>

    Pair<double> p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n"; // 使用模板参数推导调用 max<double>（推荐）

    return 0;
}
```

`max()` 函数模板相当直接。因为我们想传入一个 `Pair<T>` ，我们需要编译器理解 `T` 是什么。因此，我们需要以模板参数声明开始我们的函数，该声明定义了模板类型 T。然后我们可以将 `T` 用作我们的返回类型，以及 `Pair<T>` 的模板类型。

当 `max()` 函数被调用并传入 `Pair<int>` 参数时，编译器将从函数模板中实例化 `int max<int>(Pair<int>)` 函数，其中模板类型 `T` 将被 `int` 替换。以下代码片段展示了在这种情况下编译器实际实例化的内容：
```cpp
template <>
constexpr int max(Pair<int> p)
{
    return (p.first < p.second ? p.second : p.first);
}
```

对于所有函数模板的调用，我们可以明确指定模板类型参数（例如 `max<int>(p1)` ），也可以使用隐式方式（例如 `max(p2)` ），让编译器通过模板参数推断来确定模板类型参数应该是什么。

### 带有模板类型和非模板类型成员的类模板

类模板可以包含使用模板类型的成员和使用普通（非模板）类型的成员。例如：
```cpp title=main
template <typename T>
struct Foo
{
    T first{};    // first 的类型由 T 决定
    int second{}; // second 始终是 int，与 T 无关
};
```

这完全符合你的预期： `first` 将是模板类型 `T` 的值，而 `second` 将始终是一个 `int` 。

### 带多个模板类型的类模板

类模板也可以有多个模板类型。例如，如果我们希望我们的 `Pair` 类的两个成员能够有不同的类型，我们可以定义一个带有两个模板类型的 `Pair` 类模板：
```cpp
#include <iostream>

template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

template <typename T, typename U>
void print(Pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    Pair<int, double> p1{ 1, 2.3 }; // 保存 int 和 double 的 pair
    Pair<double, int> p2{ 4.5, 6 }; // 保存 double 和 int 的 pair
    Pair<int, int> p3{ 7, 8 };      // 保存两个 int 的 pair

    print(p2);

    return 0;
}
```

要定义多个模板类型，在我们的模板参数声明中，我们用逗号分隔每个期望的模板类型。在上述示例中，我们定义了两种不同的模板类型，一种名为 `T` ，另一种名为 `U` 。 `T` 和 `U` 的实际模板类型参数可以不同（如上例中的 `p1` 和 `p2` ），也可以相同（如 `p3` ）。

### 让函数模板与多种类类型一起工作

考虑上述示例中的 `print()` 函数模板：
```cpp
template <typename T, typename U>
void print(Pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}
```

因为我们明确地将函数参数定义为 `Pair<T, U>` ，只有类型为 `Pair<T, U>` （或可以转换为 `Pair<T, U>` ）的实参才会匹配。如果我们只想能够用 `Pair<T, U>` 类型的实参调用我们的函数，这是理想的选择。

在某些情况下，我们可能编写函数模板，希望它能与任何能够成功编译的类型一起使用。为此，我们只需将类型模板参数用作函数参数即可。

例如：
```cpp
#include <iostream>

template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

struct Point
{
    int first{};
    int second{};
};

template <typename T>
void print(T p) // 类型模板参数可匹配任何类型
{
    std::cout << '[' << p.first << ", " << p.second << ']'; // 仅当类型有 first/second 成员时可编译
}

int main()
{
    Pair<double, int> p1{ 4.5, 6 };
    print(p1); // 匹配 print(Pair<double, int>)

    std::cout << '\n';

    Point p2 { 7, 8 };
    print(p2); // 匹配 print(Point)

    std::cout << '\n';

    return 0;
}
```

在上述示例中，我们将 `print()` 重写为仅有一个类型模板参数（ `T` ），它将匹配任何类型。函数体将成功编译，适用于任何具有 `first` 和 `second` 成员的类类型。我们通过用类型为 `Pair<double, int>` 的对象调用 `print()` ，然后再次用类型为 `Point` 的对象调用，来演示这一点。

有一种情况可能会产生误导。考虑以下 `print()` 的版本：
```cpp
template <typename T, typename U>
struct Pair // 定义名为 Pair 的类类型
{
    T first{};
    U second{};
};

template <typename Pair> // 定义名为 Pair 的类型模板参数（遮蔽类类型 Pair）
void print(Pair p)       // 这里的 Pair 指模板参数，不是类类型 Pair
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}
```

你可能期望这个函数只会在传入 `Pair` 类类型参数时匹配。但这个版本的 `print()` 在功能上与之前模板参数名为 `T` 的版本相同，并且会匹配任何类型。这里的问题是，当我们把 `Pair` 定义为类型模板参数时，它会遮蔽全局作用域中其他名为 `Pair` 的用法。所以在函数模板内部， `Pair` 指的是模板参数 `Pair` ，而不是类类型 `Pair` 。由于类型模板参数会匹配任何类型，这个 `Pair` 会匹配任何参数类型，而不仅仅是类类型 `Pair` ！

这是一个坚持使用简单模板参数名称的好理由，例如 `T` 、 `U` 、 `N` ，因为它们不太可能遮蔽类类型名称。

### std::pair

由于处理数据对很常见，C++标准库中包含一个名为 `std::pair` （在 `<utility>` 头文件中定义）的类模板，它与前一节中定义的具有多个模板类型的 `Pair` 类模板完全相同。事实上，我们可以用我们开发的 `pair` 结构体替换 `std::pair` 。
```cpp
#include <iostream>
#include <utility>

template <typename T, typename U>
void print(std::pair<T, U> p)
{
    // std::pair 的成员名固定为 first 和 second
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    std::pair<int, double> p1{ 1, 2.3 }; // 保存 int 和 double 的 pair
    std::pair<double, int> p2{ 4.5, 6 }; // 保存 double 和 int 的 pair
    std::pair<int, int> p3{ 7, 8 };      // 保存两个 int 的 pair

    print(p2);

    return 0;
}
```

我们在本课中开发了自己的 `Pair` 类来展示其工作原理，但在实际代码中，你应该优先使用 `std::pair` 而不是自己编写。

### 在多个文件中使用类模板

和函数模板一样，类模板通常在头文件中定义，以便它们可以被任何需要它们的代码文件包含。模板定义和类型定义都免于单一定义规则，所以这不会造成问题：
```cpp title:pair.h
#ifndef PAIR_H
#define PAIR_H

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first < p.second ? p.second : p.first);
}

#endif
```

```cpp title:foo.cpp
#include "pair.h"
#include <iostream>

void foo()
{
    Pair<int> p1{ 1, 2 };
    std::cout << max(p1) << " is larger\n";
}
```

```cpp title:main.cpp
#include "pair.h"
#include <iostream>

void foo(); // 函数 foo 的前向声明

int main()
{
    Pair<double> p2 { 3.4, 5.6 };
    std::cout << max(p2) << " is larger\n";

    foo();

    return 0;
}
```

## 类模板参数推导（CTAD）和推导指南

### 类模板参数推导（CTAD）==C++17==

从 C++17 开始，当从类模板实例化对象时，编译器可以从对象的初始化器的类型推导出模板类型（这称为类模板参数推导，简称 CTAD）。例如：
```cpp
#include <utility> // 用于 std::pair

int main()
{
    std::pair<int, int> p1{ 1, 2 }; // 显式指定 std::pair<int, int>（C++11 起）
    std::pair p2{ 1, 2 };           // 使用 CTAD 推导为 std::pair<int, int>（C++17）

    return 0;
}
```

只有当没有提供模板参数列表时，才会执行 CTAD。因此，以下两种情况都是错误的：
```cpp
#include <utility> // 用于 std::pair

int main()
{
    std::pair<> p1 { 1, 2 };    // 错误：模板参数过少，无法推导
    std::pair<int> p2 { 3, 4 }; // 错误：模板参数过少，第二个参数无法推导

    return 0;
}
```

由于 CTAD 是一种类型推导形式，我们可以使用字面量后缀来改变推导的类型：
```cpp
#include <utility> // 用于 std::pair

int main()
{
    std::pair p1 { 3.4f, 5.6f }; // 推导为 pair<float, float>
    std::pair p2 { 1u, 2u };     // 推导为 pair<unsigned int, unsigned int>

    return 0;
}
```

### 模板参数推导向导 ==C++17==

在大多数情况下，CTAD 可以直接使用。然而，在某些情况下，编译器可能需要额外的帮助来理解如何正确推导模板参数。

你可能会发现，以下程序（与上面使用 `std::pair` 的示例几乎相同）在 C++17（仅）中无法编译
```cpp
// 定义我们自己的 Pair 类型
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

int main()
{
    Pair<int, int> p1{ 1, 2 }; // 可以：显式指定模板参数
    Pair p2{ 1, 2 };           // C++17 编译错误（C++20 可行）

    return 0;
}
```

如果你在 C++17 中编译这段代码，你可能会得到一些关于“类模板参数推导失败”或“无法推导模板参数”或“没有可行的构造函数或推导指南”的错误。这是因为 C++17 中，CTAD 不知道如何推导聚合类模板的模板参数。为了解决这个问题，我们可以向编译器提供一个<font color="#4dfe50">推导指南</font>(**deduction guide**)，告诉编译器如何推导给定类模板的模板参数。

这里是用推导指南的相同程序：
```cpp
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

// Pair 的推导指南（仅 C++17 需要）
// 用 T 和 U 初始化的 Pair 对象应推导为 Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;

int main()
{
    Pair<int, int> p1{ 1, 2 }; // 显式指定 Pair<int, int>（C++11 起）
    Pair p2{ 1, 2 };           // 使用 CTAD 推导 Pair<int, int>（C++17）

    return 0;
}
```

这个例子应该在 C++17 下编译。

我们 `Pair` 类的推导向导相当简单，但让我们更仔细地看看它是如何工作的。
```cpp
// Pair 的推导指南（仅 C++17 需要）
// 用 T 和 U 初始化的 Pair 对象应推导为 Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;
```

首先，我们使用与我们的 `Pair` 类相同的模板类型定义。这很合理，因为如果我们的推导向导要告诉编译器如何推导 `Pair<T, U>` 的类型，我们必须定义 `T` 和 `U` （模板类型）。其次，在箭头的右侧，是我们帮助编译器推导的类型。在这种情况下，我们希望编译器能够为类型为 `Pair<T, U>` 的对象推导模板参数，所以我们在这里正是这样写的。最后，在箭头的左侧，我们告诉编译器要寻找什么样的声明。在这种情况下，我们告诉它要寻找一个名为 `Pair` 、具有两个参数（一个类型为 `T` ，另一个类型为 `U` ）的对象的声明。我们也可以将其写为 `Pair(T t, U u)` （其中 `t` 和 `u` 是参数的名称，但由于我们不使用 `t` 和 `u` ，因此无需给它们命名）。

将所有内容综合起来，我们告诉编译器，如果它看到一个具有两个参数（分别为 `T` 和 `U` 类型的参数）的 `Pair` 声明，它应该推导出类型为 `Pair<T, U>` 。

所以当编译器看到我们程序中的定义 `Pair p2{ 1, 2 };` 时，它会说：“哦，这是一个 `Pair` 的声明，有两个类型为 `int` 和 `int` 的参数，所以使用推演向导，我应该将其推演为 `Pair<int, int>` ”。

这里有一个接受单个模板类型的 Pair 的类似示例：
```cpp
template <typename T>
struct Pair
{
    T first{};
    T second{};
};

// Pair 的推导指南（仅 C++17 需要）
// 用 T 和 T 初始化的 Pair 对象应推导为 Pair<T>
template <typename T>
Pair(T, T) -> Pair<T>;

int main()
{
    Pair<int> p1{ 1, 2 }; // 显式指定 Pair<int>（C++11 起）
    Pair p2{ 1, 2 };      // 使用 CTAD 推导 Pair<int>（C++17）

    return 0;
}
```

在这种情况下，我们的推导向导将一个 `Pair(T, T)` （一个 `Pair` ，具有两个类型为 `T` 的参数）映射到 `Pair<T>` 。

> [!TIP] 提示
> C++20 增加了编译器自动为聚合生成推导向导的能力，因此推导向导只需为 C++17 兼容性提供。
> 
> 因此，不带推导向导的 `Pair` 版本应该在 C++20 中可以编译。
> 
> `std::pair` （以及其他标准库模板类型）自带预定义的推导指南，这也是为什么我们上面使用 `std::pair` 的示例能在 C++17 中无需我们自行提供推导指南即可正常编译的原因。

### 为模板类型参数指定默认值

就像函数参数可以有默认参数一样，模板参数也可以被赋予默认值。当模板参数没有被明确指定且无法推导时，这些默认值将被使用。

这是我们对上面 `Pair<T, U>` 类模板程序的修改，将类型模板参数 `T` 和 `U` 默认为类型 `int` ：
```cpp
template <typename T=int, typename U=int> // 默认 T 和 U 为 int
struct Pair
{
    T first{};
    U second{};
};

template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;

int main()
{
    Pair<int, int> p1{ 1, 2 }; // 显式指定 Pair<int, int>（C++11 起）
    Pair p2{ 1, 2 };           // 使用 CTAD 推导 Pair<int, int>（C++17）

    Pair p3;                   // 使用默认 Pair<int, int>

    return 0;
}
```

我们对 `p3` 的定义没有明确指定类型模板参数的类型，也没有提供用于推导这些类型的初始化器。因此，编译器将使用默认指定的类型，这意味着 `p3` 将具有类型 `Pair<int, int>` 。

### CTAD 不适用于非静态成员初始化

当使用非静态成员初始化来初始化类类型的成员时，在此上下文中 CTAD 将不起作用。所有模板参数都必须显式指定：
```cpp
#include <utility> // 用于 std::pair

struct Foo
{
    std::pair<int, int> p1{ 1, 2 }; // 可以，显式指定模板参数
    std::pair p2{ 1, 2 };           // 编译错误：此处不能使用 CTAD
};

int main()
{
    std::pair p3{ 1, 2 };           // 可以：此处可使用 CTAD
    return 0;
}
```

### CTAD 不适用于函数参数

CTAD 代表类模板参数推导，而不是类模板参数推导，因此它只会推导模板参数的类型，而不会推导模板参数。

因此，CTAD 不能用于函数参数。
```cpp
#include <iostream>
#include <utility>

void print(std::pair p) // 编译错误：此处不能使用 CTAD
{
    std::cout << p.first << ' ' << p.second << '\n';
}

int main()
{
    std::pair p { 1, 2 }; // p 推导为 std::pair<int, int>
    print(p);

    return 0;
}
```

在这种情况下，你应该使用模板：
```cpp
#include <iostream>
#include <utility>

template <typename T, typename U>
void print(std::pair<T, U> p)
{
    std::cout << p.first << ' ' << p.second << '\n';
}

int main()
{
    std::pair p { 1, 2 }; // p 推导为 std::pair<int, int>
    print(p);

    return 0;
}
```

## 别名模板

为类模板创建别名，其中所有模板参数都明确指定，其工作方式与普通 type alias 完全相同：
```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
void print(const Pair<T>& p)
{
    std::cout << p.first << ' ' << p.second << '\n';
}

int main()
{
    using Point = Pair<int>; // 创建普通类型别名
    Point p { 1, 2 };        // 编译器会将其替换为 Pair<int>

    print(p);

    return 0;
}
```

这些别名可以局部定义（例如在函数内部）或全局定义。

### 别名模板

在其他情况下，我们可能需要一个模板类的类型别名，其中并非所有模板参数都作为别名的一部分定义（而是由类型别名的用户提供）。为此，我们可以定义一个别名模板，它是一个可以用来实例化类型别名的模板。就像类型别名不定义不同的类型一样，别名模板也不定义不同的类型。

这里有一个如何工作的示例：
```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

// 这是我们的别名模板
// 别名模板必须在全局作用域中定义
template <typename T>
using Coord = Pair<T>; // Coord 是 Pair<T> 的别名

// print 函数模板需要知道 Coord 的模板参数 T 是类型模板参数
template <typename T>
void print(const Coord<T>& c)
{
    std::cout << c.first << ' ' << c.second << '\n';
}

int main()
{
    Coord<int> p1 { 1, 2 }; // C++20 之前：必须显式指定模板参数
    Coord p2 { 1, 2 };      // C++20 起：在可用 CTAD 的场景可用别名模板推导

    std::cout << p1.first << ' ' << p1.second << '\n';
    print(p2);

    return 0;
}
```

在这个例子中，我们定义了一个名为 `Coord` 的别名模板，作为 `Pair<T>` 的别名，其中类型模板参数 `T` 将由 Coord 别名的用户定义。 `Coord` 是别名模板， `Coord<T>` 是 `Pair<T>` 的实例化类型别名。一旦定义，我们可以在需要 `Pair` 的地方使用 `Coord` ，在需要 `Pair<T>` 的地方使用 `Coord<T>` 。

关于这个例子，有几点值得注意。

首先，与普通类型别名（可以在代码块内部定义）不同，别名模板必须在全局作用域中定义（因为所有模板都必须如此）。

其次，在 C++20 之前，当我们使用别名模板实例化对象时，必须显式指定模板参数。从 C++20 开始，我们可以使用<font color="#4dfe50">别名模板推导</font>(**alias template deduction**)，它将在别名类型可以使用 CTAD 的情况下，从初始化器中推导模板参数的类型。

第三，因为 CTAD（Class Template Argument Deduction，类模板参数推导）不适用于函数参数，当我们将别名模板用作函数参数时，我们必须显式地定义别名模板使用的模板参数。换句话说，我们这样做：
```cpp
template <typename T>
void print(const Coord<T>& c)
{
    std::cout << c.first << ' ' << c.second << '\n';
}
```

而不是这个：
```cpp
void print(const Coord& c) // 不可行，缺少模板参数
{
    std::cout << c.first << ' ' << c.second << '\n';
}
```

这和如果我们使用 `Pair` 或 `Pair<T>` 而不是 `Coord` 或 `Coord<T>` 没有什么不同。
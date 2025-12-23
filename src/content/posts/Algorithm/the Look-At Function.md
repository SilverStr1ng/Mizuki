---
title: the Look-At Function
description: Intro about the look-at Function.
published: 2025-12-23
pinned: false
tags:
  - ComputerGraphics
  - Algorithm
draft: false
category: ComputerGraphics
created: 2025-12-23
---

## Placing the Camera

在 3D 场景中定位相机至关重要。我们通常使用一个 $4\times4$ 矩阵来设置相机的位置和方向（注意，缩放相机是没有意义的），这个矩阵通常被称为相机到世界(camera-to-world)矩阵。然而，手动配置一个 $4\times4$ 矩阵可能会很麻烦。

幸运的是，有一种通常称为 the look-at method 的函数可以简化这个过程。这个概念很简单：要确定相机的位置和方向，您需要的是一个空间中的点作为相机的位置，另一个点来定义相机的瞄准方向。我们将第一个点标记为 `from`，第二个点标记为 `to`。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223090943.png)

从这两个点出发，我们可以轻松构建一个世界到相机的 $4\times4$ 矩阵。

然而，在继续之前，让我们澄清一个可能的混淆来源。在右手坐标系中，如果您沿着 z 轴观察，x 轴指向右侧，y 轴指向上方，z 轴指向您，如下图所示。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223091643.png)

因此，在设想新的相机设置时，将相机定向为仿佛在查看右手坐标系，z 轴指向相机（如上所示）似乎是自然的。由于相机通常以这种方式定向，一些文本（例如《基于物理的渲染 / PBRT》）建议这种定向意味着相机是在左手坐标系中定义的，在沿着 z 轴向下看时，z 轴指向远离你（与视线方向相同）。虽然右手坐标系是标准的，但为相机提出例外可能会导致混淆。

我们更倾向于认为相机在右手坐标系中操作，然而，在渲染时，我们通过沿相机的局部 z 轴将光线方向缩放为-1 来反转相机的方向。当将光线投射到场景中时。光线方向的 z 分量在通过相机到世界的矩阵转换光线方向向量之前被设置为-1。这个调整并不完全是缩放；它只是**沿相机的局部 z 轴反转光线方向向量**。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223092813.png)

> 底线是：如果您的应用程序使用右手坐标系，为了保持一致性，摄像机也应该在右手坐标系中定义，就像任何其他 3D 对象一样。然而，由于我们以相反的方向投射光线，这实际上看起来就像摄像机沿着负 z 轴向下看。解决了这个澄清后，让我们现在探讨如何构建这个矩阵。

![相机瞄准某一点的局部坐标系统。](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223093303.png)

![从相机和目标点的位置计算前向向量。](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223093519.png)


请记住，$4\times4$ 矩阵编码了笛卡尔坐标系的三个轴。请注意，在处理矩阵和坐标系统时，有两个约定需要考虑。对于矩阵，您必须在<font color="#4dfe50">行主序</font>(**row-major**)和<font color="#4dfe50">列主序</font>（**column-major**）表示之间做出选择。我们将使用行主序表示。至于坐标系统，您必须在右手坐标系和左手坐标系之间选择。我们将采用右手坐标系。$4\times4$ 矩阵的第四行（在行主序表示中）编码了平移值。
$$
\begin{array}{cccc}
\color{red}{Right_x} & \color{red}{Right_y} & \color{red}{Right_z} & 0 \\
\color{green}{Up_x} & \color{green}{Up_y} & \color{green}{Up_z} & 0 \\
\color{blue}{Forward_x} & \color{blue}{Forward_y} & \color{blue}{Forward_z} & 0 \\
T_x & T_y & T_z & 1
\end{array}
$$

![向量 (0,1,0) 位于由前向和上向向量定义的平面内。与该平面垂直的向量因此是右向量](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251223094250.png)


笛卡尔坐标系的轴命名是任意的。你可以将它们称为 x、y 和 z，但为了本课的清晰起见，我们将它们命名为 right（x 轴）、up（y 轴）和 forward（z 轴），如图 1 所示。从一对点 `from` 和 `to` 构建 $4\times4$ 矩阵的过程可以总结为四个步骤：

- **Step1: 计算前向轴。** 相机局部坐标系的前向轴与由点 `from` 和 `to` 定义的线段对齐。只需一点几何知识即可计算这个向量。你需要对向量 `From-To` 进行归一化。注意这个向量的方向：它是 `From-To`，而不是 `To-From`。这个操作可以通过以下代码片段来完成：

```glsl title=calcForward
vec3 forward = Normalize(From - To)
```

现在我们来计算另外两个向量。

- **Step2: 计算右向量。** 笛卡尔坐标由三个相互垂直的单位向量定义。我们还理解，如果我们取两个向量 $\overrightarrow{A}$ 和 $\overrightarrow{B}$，它们可以被视为位于一个平面内。此外，这两个向量的叉积产生一个第三个向量 $\overrightarrow{C}$，它垂直于该平面，因此也垂直于 $\overrightarrow{A}$ 和 $\overrightarrow{B}$。这个特性使我们能够生成右向量。该策略涉及使用一个任意向量来计算前向量与这个任意向量之间的叉向量。结果是一个必然垂直于前向量的向量，然后可以在我们的笛卡尔坐标系统中用作右向量。计算这个向量的代码很简单，只需对前向量和这个任意向量进行叉积：

```glsl title=calcRight
vec3 right = crossProduct(randomVec, forward);
```

我们应该如何选择这个任意向量？实际上，这个向量不能真正是任意的，这就是为什么这个词是斜体的。考虑这一点：如果前向量是 (0,0,1)，那么右向量应该是 (1,0,0)。只有当我们选择向量 (0,1,0) 作为我们的任意向量时，这个结果才能实现。确实，$(0,1,0)\times(0,0,1)=(1,0,0)$，其中 $\times$ 表示叉积。

> [!CITE] 关于滚转相机的矩阵
> 还要注意，从这个观察中可以看出，右向量始终位于 xz 平面内。你可能会想，如果对相机应用滚转会将右向量放置在不同的平面上，这怎么可能呢？确实，使用注视方法直接对相机应用滚转是不可行的。要实现相机的滚转，首先需要创建一个用于滚转相机的矩阵（围绕 z 轴旋转相机），然后将此矩阵与使用注视方法构建的相机到世界的矩阵相乘。

以下是计算右向量的最终代码：

```glsl title=right
vec3 tmp = (0, 1, 0);
vec3 right = crossProduct(tmp, forward)
```

在计算叉积时，注意向量的顺序是很重要的。请记住，叉积操作是反交换的（有关更多细节，请参阅几何课程）。一个有助于记住正确顺序的助记符是考虑前向向量 (0,0,1) 与上向量 (0,1,0) 的叉积，我们知道应该得到 (1,0,0) 而不是 (-1,0,0)。熟悉叉积方程应该很容易揭示出正确的顺序是 $up\times forward$ 而不是反向。现在我们有了前向和右向向量，让我们继续确定“真实”的上向量。

- **Step3: 计算上向量。** 这个步骤很简单：给定两个正交向量，前向向量和右向向量，计算这两个向量之间的叉积会得到缺失的第三个向量，即上向量。如果前向和右向向量是单位化的，那么从叉积计算得到的上向量也将是单位化的（$u$ 和 $v$ 的叉积的大小取决于 $u$ 和 $v$, $||u\times v||=||u|| \cdot ||v|| \cdot \sin\theta$  确定的平行四边形的面积）：

```glsl title=calcUp
vec3 up = crossProduct(forward, right)
```

再次强调，注意叉乘中向量的顺序是很重要的。我们现在有了定义相机坐标系的三个向量。接下来我们将构建最终的 $4\times4$ 相机到世界的矩阵。

- **Step4: 使用右向量、上向量和前向量作为基向量设置 $4\times 4$ 矩阵。** 剩下的任务是构建相机到世界的矩阵。这涉及用适当的数据替换矩阵的每一行：
	- 第 1 行：用右向量的坐标替换前三个系数
	- 第 2 行：用上向量的坐标替换前面三个系数
	- 第 3 行：用前向量的坐标替换前面三个系数
	- 第 4 行：用起点的坐标替换前面三个系数。

## 参考

1. [scratchapixel](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/lookat-function/framing-lookat-function.html)

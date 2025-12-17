---
title: Part I Ray Tracing
description: Translation of the book, Computer Graphics from Scratch A Programmers Introduction to 3 D Rendering (Gabriel Gambetta)
published: 2025-12-17
pinned: true
tags:
  - TraceRay
  - ComputerGraphics
draft: false
category: ComputerGraphics
---

## 基本光线追踪

### 基本假设

计算机图形学的魅力之一在于将图像绘制到屏幕上。为了尽快实现这一目标，我们将做一些简化假设:
- 首先，我们将假设一个固定的观察位置。这个观察位置就是你放置眼睛的地方，通常被称为相机位置；我们称之为 O。
- 其次，我们将假设一个固定的相机朝向。相机朝向决定了相机朝向哪个方向。我们将假设它朝向正 Z 轴方向（我们简写为 $\overrightarrow{Z}_{+}$），正 Y 轴（$\overrightarrow{Y}_{+}$）向上，正 X 轴（$\overrightarrow{X}_{+}$）向右。
![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251212152132.png)


相机的位置和朝向现在已固定。仍缺少的是我们观察场景的“画框”。我们将假设这个画框具有尺寸 $V_{w}$ 和 $V_{h}$，并且正对相机朝向——即垂直于 $\overrightarrow{Z}_{+}$。我们还将假设它距离为 $d$，其边与 $X$ 轴和 $Y$ 轴平行，并且相对于 $\overrightarrow{Z}$ 居中。这听起来有些复杂，但实际上相当简单。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251212152759.png)


将作为我们通向世界的窗口的矩形称为<font color="#4dfe50">视口</font>(view-port)。视口的大小和相机的距离决定了从相机可见的角度，称为<font color="#4dfe50">视场角</font>（Field of View，简称 FOV）。人类的水平视场角几乎为 180 度（尽管其中大部分是模糊的周边视觉，且缺乏深度感知）。为简化起见，我们将 $V_{w} = V_{h} = d = 1$；这会产生约 53 度的视场角，从而生成外观合理且不过度失真的图像。

> [!NOTE] 
> 53°的计算方法
> ![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251212152924.png)

**现在我们回到"算法"层面, 对步骤进行编号:**

---
1. 将摄像机和视口放置到所需位置
对于每个画布上的像素:
2. 确定视口上对应于此像素的方块
3. 确定通过该方块所看到的颜色
4. 将该颜色绘制到像素上
---

我们刚刚完成了步骤 ①（或者更准确地说，暂时将其处理完毕）。步骤 ④ 非常简单：我们只需使用 `canvas.PutPixel (x, y, color)`。我们快速完成步骤 ②，然后在接下来的几章中，将逐步关注如何以越来越复杂的方式实现步骤 ③。

### 画布到视口

一个像素, 将其表示为 ($C_{x}$, $C_{y}$), 我们如何方便地将视口放置，使其轴与画布的轴方向一致，且其中心与画布中心对齐。由于视口以世界单位测量，而画布以像素测量，因此从画布坐标转换为空间坐标仅需一个比例变换。
$$
V_{x} = C_{x} \cdot \frac{V_{w}}{C_{w}}
$$
$$
V_{y} = C_{y} \cdot \frac{V_{h}}{C_{h}}
$$
还有一个额外的细节。虽然视口是二维的，但它嵌入在三维空间中。我们将其定义为距离相机 d 的位置；该平面（称为投影平面）上的每个点，根据定义，其 $z$ 坐标等于 $d$。因此:
$$
V_{c} = d
$$
至此，我们完成了这一步。对于画布上的每个像素 ($C_{x}$, $C_{y}$)，我们可以确定其在视口中的对应点 ($V_{x}$, $V_{y}$, $V_{z}$)。

### 追踪光线

下一步是确定从摄像机视角（$O_{x}$, $O_{y}$, $O_{z}$）看来，穿过（$V_{x}$, $V_{y}$, $V_{z}$）点的光线是什么颜色。

在现实世界中，光线来自光源（如太阳、灯泡等），在多个物体表面反射，最终到达我们的眼睛。我们本可以尝试模拟从每个模拟光源发出的光子路径，但这将极其耗时。

作为替代，我们将光线“倒着”考虑：从摄像机出发，穿过视口中的某一点，追踪其路径直到"击中"场景中的某个物体。这个物体就是摄像机通过该视口点“看到”的物体。因此，作为初步近似，我们将该物体的颜色视为"穿过该点的光线的颜色(the color of the light coming through that point)"。
![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251212155546.png)

现在, 我们需要一些公式了。

#### 射线方程

为了我们的目的，最方便的方式来表示一条射线是使用参数方程。我们知道射线经过点 $O$，也知道其方向（从 $O$ 指向 $V$），因此我们可以将射线上的任意一点 $P$ 表示为:
$$
P = O + t(V - O)
$$
其中, $t$ 为任意实数。通过将 t 从 $- \infty$ 到 $+ \infty$ 的每一个值代入该方程，我们就能得到射线上的每一个点 $P$。

我们称 ($V - O$) 为射线方向 $\overrightarrow{D}$, 方程则表示为:
$$
P = O + t \overrightarrow{D}
$$

#### 球体方程

现在我们需要在场景中加入某种物体，以便我们的射线能够击中它。我们可以选择任意几何原语作为场景的构建块；对于光线追踪，我们将使用球体，因为它们可以用方程轻松处理。

球体是指距离一个固定点固定距离的所有点的集合。这个距离称为球体的半径，该点称为球体的中心。

根据我们上面的定义，如果 $C$ 是一个球体的中心，$r$ 是其半径，那么位于该球体表面的点 $P$ 必须满足以下方程：
$$
distance(P，C)=r
$$
我们将其进行一些简单的转换，可以得到该方程的以下形式：
$$
（P-C, P-C）= r^{2}
$$
> [!NOTE] 
> 关于转换的详细过程（待补充）


#### 射线与球体相交

现在我们有两个方程，一个描述球面上的点，另一个描述射线上的点：
$$
（P-C, P-C） = r^{2} \tag{1}
$$
$$
P = O + t \overrightarrow{D} \tag{2}
$$
射线与球体相交吗？如果相交，交点在哪里？

假设射线与球体在某点 $P$ 相交。该点既位于射线上，又位于球体表面，因此必须同时满足这两个方程。注意，这两个方程中唯一的变量是参数 $t$，因为 $O$，$\overrightarrow{D}$，$C$ 和 $r$ 已知，$P$ 是我们试图求出的点。

由于 $P$ 在两个方程中表示同一个点，我们将第一个方程中的 $P$ 替换为第二个方程中的 $P$ 的表达式，这样我们得到：
$$
（O+t \overrightarrow{D}-C,O+t \overrightarrow{D}-C）= r^{2}
$$
如果我们能找到满足该方程的 $t$ 值，就可以将它们代入射线方程，从而找到射线与球体相交的点。

我们对上述方程进行一些代数变换，以得到一个更简洁的结果：
$$
at^{2} + bt + c = 0
$$
> [!NOTE] 
> 关于代数变换的详细过程

这只是一个普通的二次方程，它的解就是射线与球体相交时参数 $t$ 的值：
$$
\{t_{1},t_{2}\} = \frac{-b\pm\sqrt{b^{2}-4ac}}{2a}
$$
您可能记得，二次方程的解的数量取决于判别式 $b^{2}-4ac$ 的值，可能无解、有一个重根，或者有两个不同的解。这恰好对应于射线不与球体相交、射线与球体相交、以及射线进入并穿出球体的三种情况。
![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251215164522.png)

一旦我们求得 $t$ 的值，就可以将其代入射线方程，最终得到对应该 $t$ 值的交点 $P$。

#### 渲染我们的第一个球体

简而言之，对于画布上的每个像素，我们可以计算出其在视口上的对应点。已知摄像机的位置，我们便可以写出一条从摄像机出发并穿过视口上该点的射线方程。给定一个球体，我们可以计算光线与该球体的交点。

所以我们要做的就是**计算光线上与每个球体的交点**，保留距离相机**最近**的那个交点，并且用相应的颜色将像素绘制在画布上。我们几乎可以渲染出第一个球体了！不过，参数 $t$ 值得特别关注一下。让我们回到光线方程：
$$
P = O + t（V-O）
$$

由于光线的起点和方向是固定的，$t$ 在所有实数范围内变化时，将生成该光线上的每一个点 $P$。注意，当 $t=0$ 时，$P=O$；当 $t=1$ 时，$P=V$。$t$ 为负数时，得到的点位与相反方向 —— 即在相机后方。因此，我们可以将参数空间划分为三个部分，如下图所示

---

| t < 0       | 在相机后面         |
| ----------- | ------------- |
| 0 <= t <= 1 | 在相机和投影平面/视口之间 |
| t > 1       | 在投影平面/视口前面    |

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251215173041.png)

---

请注意，交点方程中没有任何内容表明球体必须位于摄像机前方；该方程会愉快地产生位于摄像机后方的交点解。显然，我们并不需要这些解，因此我们应该忽略所有 $t<0$ 的解。为了避免进一步的数学麻烦，我们将解的范围限制为 $t>1$；也就是说，我们将渲染投影平面之后的所有内容。

另一方面，我们不希望对 t 的值设定上限；我们希望看到相机前方的所有物体，无论它们距离多远。然而，由于在后续阶段我们希望将光线截断，我们现在就引入这种形式化方法，并给 t 设定一个上限值 +∞（对于语言无法直接表示“无穷大”的情况下，一个非常非常大的数就足以解决问题。

我们现在可以用一些伪代码来形式化我们迄今为止所做的一切。作为一般规则，**我们将假设代码可以访问它所需的所有数据**，因此我们不会费心显式传递诸如画布等参数，而只关注真正必要的参数。

```js title=main
O = (0, 0, 0)
for x = -Cw/2 to Cw/2{
	for y = -Ch/2 to Ch/2 {
		D = CanvasToViewPort(x, y)
		color = TraceRay(O, D, 1, inf)
		canvas.PutPixel(x, y, color)
	}
}
```

`CanvasToViewport` 函数非常简单，常量 $d$ 表示相机与投影平面之间的距离

```js title="CanvasToViewport"
CanvasToViewport(x, y) {
	return (x*Vw/Cw, y*Vh/Ch, d)
}
```

`TraceRay` 方法计算射线与每个球体的交点，并返回在指定 $t$ 范围内最近交点处球体的颜色。

```js title=TraceRay
TraceRay(O, D, t_min, t_max) {
	closest_t = inf
	closest_sphere = NULL
	for sphere in scene.spheres {
		t1, t2 = IntersectRaySphere(O, D, sphere)
		if t1 in [t_min, t_max] and t1 < closest_t {
			closest_t = t1
			closest_sphere = sphere
		}
		if t2 in [t_min, t_max] and t2 < closest_t {
			closest_t = t2
			closest_sphere = sphere
		}
	}
	
	if (closest_sphere == NULL) {
		return BACKGROUND_COLOR
	}
	
	return closest_sphere.color
}
```

在 `TraceRay` 方法中，$O$ 表示射线的原点；虽然我们是从位于原点的相机处追踪光线，但在后续阶段这不一定会如此，因此它必须是一个参数 `t_min` 和 `t_max` 也是如此。

> [!WARNING]
> 当光线不与任何球体相交时，我们仍需返回某种颜色。

最后，`IntersectRaySphere` 只是求解二次方程。

```js title=IntersectRaySphere
IntersectRaySphere(O, D, sphere) {
	r = sphere.radius
	CO = O - sphere.center
	
	a = dot(D, D)
	b = 2 * dot(CO, D)
	c = dot(CO, CO) - r * r
	
	discriminant = b*b - 4*a*c
	if (discriminant < 0) {
		return inf, inf
	}
	
	t1 = (-b + sqrt(discriminant)) / (2 * a)
	t2 = (-b - sqrt(discriminant)) / (2 * a)
	
	return t1, t2
}
```

为了将上述内容付诸实践，让我们定义一个非常简单的场景，如下图所示：
![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216093906.png)

下列伪代码描述了我们定义的场景：

```js title=scene
viewport_size = 1 x 1
projection_plane_d = 1
sphere {
	center = (0, -1, 3)
	radius = 1
	color = (255, 0, 0) // red
}

sphere {
	center = (2, 0, 4)
	radius = 1
	color = (0, 0, 255) //blue
}

sphere {
	center = (-2, 0, 4)
	radius = 1
	color = (0, 255, 0) // green
}
```

当我们在这个场景上运行我们的算法时，我们得到了一个最基本的光线追踪场景。

## 光照
> 我们将通过引入光照来为场景的渲染增添“真实感”。光照是一个庞大而复杂的话题，因此我们将采用一个简化模型，该模型足以满意我们的需求。

> 我们将首先做出一些简化假设，以简化我们的工作，然后引入三种类型的光源：点光源、方向光源和环境光。本章的最后将讨论这些光源如何影响表面的外观，包括漫反射和镜面反射。

### 简化假设

首先，我们声明所有光都是白色的。这使我们能够用一个实数来表征（称之为光的强度）任何光源。

其次，我们将忽略大气的影响。在现实生活中，距离越远的光源看起来越暗，这是因为光线在穿过空气时，部分光线被空气中漂浮的粒子吸收了。为了简化，我们忽略这一效果：在我们的场景中，距离不会使光源变暗。

### 光源
> 光必须来自某个地方。在本节中，我们将定义三种不同类型的光源。

#### 点光源

点光源从三维空间中的一个固定点发出光线，该点称为光源的位置。它们在各个方向上均匀地发出光线；这也是为什么它们被称为全向光源。因此，**点光源完全由其位置和强度来描述。**

灯泡是点光源在现实世界中的一个良好近似。虽然现实中灯泡并非从单一点发出光线，也不是完全全向的，但它是一个相当准确的近似。

让我们定义场景中一点 $P$ 到光源 $Q$ 的方向为向量 $\overrightarrow{L}$。我们可以计算这个向量，称为光向量，为 $Q-P$。请注意，由于 $Q$ 是固定的，但 $P$ 可以是场景中的任意一点，因此 $\overrightarrow{L}$ 对于场景中的每一点都是不同的，正如您在下图中所见。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216104812.png)

#### 方向光

如果点光源是对灯泡的良好近似，它是否也能作为太阳的近似？

这是一个棘手的问题，答案取决于我们试图渲染的内容。在太阳系尺度上，太阳可以近似为点光源。毕竟，它从一个点发出光线，并向各个方向均匀辐射，因此似乎符合这一条件。

然而，如果我们的场景描绘的是发生在地球上的事件，这种近似就不太合适了。太阳距离我们如此遥远，以至于到达我们的每一束光线几乎都具有完全相同的方向。我们可以通过一个位于场景中物体极其遥远位置的点光源来近似这种效果。但此时，光源与物体之间的距离将远大于物体之间的距离，从而导致数值精度误差。

为了更好地处理这类情况，我们定义了方向光。与点光源类似，方向光具有强度，但与点光源不同的是，它没有具体位置，而是具有固定方向。你可以将其想象为位于指定方向上的**无限远处**的点光源。

在点光源的情况下，我们需要为场景中的每个点 $P$ 计算不同的光照向量 $\overrightarrow{L}$，但在本例中, $\overrightarrow{L}$ 是给定的。在“太阳到地球”的场景示例中，$\overrightarrow{L}$ 将是（太阳中心）减去（地球中心）。下图展示了这种情形。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216105613.png)

正如我们在这里所看到的，方向光的光照向量场景中的每个点都相同。

#### 环境光

能否将现实中的每一个光源都建模为点光源或平行光？基本上可以。这两种光源类型足够照亮一个场景吗？不幸的是，不够。

考虑一下月球的情况。它附近唯一的显著光源是太阳。因此，相对于太阳而言，月球的“前半部分”会接收到所有光线，而“后半部分”则完全处于黑暗之中。我们从地球的不同角度观察到这种现象，从而形成了我们所说的“月相”。

然而，地球上的情形则略有不同。即使那些没有直接接收到光源照射的点，也并非完全黑暗（只需看看你椅子下方的地面即可）。如果这些点的“视线”被其他物体遮挡，光线是如何到达它们的呢？

当光线照射到一个物体上时，部分光线会被吸收，其余部分则会散射回场景中。这意味着光线不仅来自光源，还可能来自那些从光源接收光线并将其部分散射回场景中的物体。但为什么止步于此呢？散射的光线会再次照射到其他物体上，其中一部分被吸收，另一部分则继续散射回场景中。如此循环，直到原始光线的所有能量都被场景中的表面吸收。

这意味着我们应该将每个物体都视为一个光源。正如你所能想象的，这会给我们的模型增加大量复杂性，因此本书不会探讨这种机制。如果你对此感兴趣，可以搜索“<font color="#4dfe50">全局光照</font>（Global Illumination）”，并欣赏那些精美的图像。

但我们仍然不希望每个物体要么被直接照亮，要么完全黑暗（除非我们实际上是在渲染太阳系的模型）。为克服这一限制，我们将定义第三种类型的光源，称为环境光，它仅由其强度来表征。我们将声明环境光会向场景中的每个点贡献一些光线，无论该点的位置如何。这显然是对光源与场景中表面之间复杂相互作用的一种粗略简化，但效果已经足够好。

通常，**一个场景只会有一个环境光**（因为环境光仅具有强度值，多个环境光可以轻易合并为一个环境光），以及任意数量的点光源和方向光源。

### 单个点的照明

现在我们已经知道如何在场景中定义光源，接下来需要弄清楚这些光源如何与场景中物体的表面相互作用。

为了计算单个点的光照效果，我们将计算每个光源对该点贡献的光照量，并将它们**相加**，得到一个代表该点接收到的总光照量的数值。然后，我们可以将该点表面的颜色乘以这个数值，从而得到表示该点接收到多少光照的颜色明暗程度。

那么，当一束光线（无论是来自方向光还是点光源）照射到场景中某个物体上的某一点时，会发生什么情况呢？

我们可以直观地将物体分为两大类，依据它们反射光线的方式：“<font color="#4dfe50">哑光</font>(matte)”和“<font color="#4dfe50">光泽</font>(shiny)”物体。由于我们周围大多数物体都可以归类为哑光物体，我们将首先专注于这一类。

### 漫反射

当一束光线照射到哑光物体上时，光线会向各个方向均匀地散射回场景中，这一过程称为<font color="#4dfe50">漫反射</font>（diffuse reflection）；正是这种现象使得哑光物体看起来是哑光的。

为了验证这一点，观察你周围的某个哑光物体，比如一堵墙。如果你相对于这堵墙移动，它的颜色不会改变。也就是说，**无论你从哪个角度观察该物体，所看到的反射光都是一样的。**

另一方面，反射的光量确实取决于光线与表面之间的夹角。直观上，这是因为光线携带的能量需要根据角度分布在更小或更大的面积上，因此单位面积反射到场景中的能量相应地更高或更低，如下图所示：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216132537.png)

我们可以看到两束强度相同的光线（用相同宽度表示）以垂直和倾斜的角度照射到一个表面上。与左侧射线的情况不同，光线携带的能量均匀分布在它们照射的区域上。右侧光线的能量分布在比左侧更大的面积上。因此其区域内的每个点接收到的能量比左侧情况要少。

为了从数学上探讨这一点，我们用表面的法向量来表征表面的朝向。表面在点 $P$ 处的<font color="#4dfe50">法向量</font>（normal vector），或简称为“<font color="#4dfe50">法线</font>（the normal）”，是垂直于该点表面的一个向量。它也是一个单位向量，即其长度为 $1$。我们将这个向量记为 $\overrightarrow{N}$。

#### 建模漫反射

一束方向为 $\overrightarrow{L}$ 和强度为 $I$ 的光线照射到一个法向量为 $\overrightarrow{N}$ 的平面。作为 $I$，$\overrightarrow{N}$ 和 $\overrightarrow{L}$ 的函数，有多少比例的 $I$ 会反射到场景中？

作为几何类比，让我们将光的强度表示为射线的“宽度”。它的能量分布在大小为 $A$ 的表面上。当 $\overrightarrow{N}$ 和 $\overrightarrow{L}$ 方向相同时——当射线垂直于表面时——那么 $I = A$，这意味着单位面积反射的能量与单位面积入射的能量相同：$ \frac{I}{A}=1$ 。另一方面，当 $\overrightarrow{L}$ 和 $\overrightarrow{N}$ 之间的角度接近 $90°$ 时，$A$ 接近 $\infty$，所以单位面积的能量接近 $0$；$\lim_{A \to \infty}\frac{I}{A} = 0$。但中间会发生什么？

情况如下图所示：我们已知 $\overrightarrow{N}$, $\overrightarrow{L}$ 和 $P$；我添加了角度 $\alpha$ 和 $\beta$ ，以及点 $Q$，$R$ 和 $S$，以便更方便地描述该图。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216134426.png)

由于光线在技术上没有宽度，我们可以假设所有现象都发生在表面一个扁平的、无限小的区域上。即使该表面是球面，我们所考虑的区域如此之小，以至于与球体本身的大小相比几乎可以视为平面，就像在小尺度下地球看起来是平的那样。

宽度为 $I$ 的光线在点 $P$ 处以角度 $\beta$ 射向表面。点 $P$ 处的法线为 $\overrightarrow{N}$，该光线携带的能量分布在面积 $A$ 上。我们需要计算 $\frac{I}{A}$。

考虑 $RS$，也就是光线的“宽度”。根据定义，它垂直于 $\overrightarrow{L}$, 而 $\overrightarrow{L}$ 同时也是 $\overrightarrow{PQ}$ 的方向。因此 $PQ$ 与 $QR$ 形成直角。使得 $\triangle{PQR}$ 为**直角三角形**。

$\triangle{PQR}$ 的一个角是 $90°$，另一个角是 $\beta$。因此，剩下的一个角是 $90 - \beta$。但是请注意，向量 $\overrightarrow{N}$ 和 $PR$ 也形成一个直角，这意味着 $\alpha + \beta$ 也必须等于 90 度。因此 $\angle{QRP} = \alpha$。

让我们聚焦于 $\triangle{PQR}$（下图）。它的三个角分别是 $\alpha$、$\beta$ 和 $90$ 度。边 $QR$ 的长度为 $\frac{I}{2}$，边 $PR$ 的长度为 $\frac{A}{2}$。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216140042.png)

现在，我们需要用到一些三角学知识。根据定义 $\cos(\alpha) = \frac{QR}{PR}$；用 $\frac{I}{2}$ 替换 $QR$；用 $\frac{A}{2}$ 替换 PR，我们得到：
$$
\cos (\alpha) = \frac{\frac{I}{2}}{\frac{A}{2}}
$$
等价于:
$$
\cos (\alpha) = \frac{I}{A}
$$
我们几乎完成了！$\alpha$ 是向量 $\overrightarrow{N}$ 和 $\overrightarrow{L}$ 之间的夹角。我们可以利用点积的性质将 $\cos (\alpha)$ 表达为：
$$
\cos (\alpha) = \frac{（\overrightarrow{N}, \overrightarrow{L}）}{|\overrightarrow{N}||\overrightarrow{L}|}
$$
最后：
$$
\frac{I}{A} = \frac{（\overrightarrow{N}, \overrightarrow{L}）}{|\overrightarrow{N}||\overrightarrow{L}|}
$$

我们得到了一个简单的方程，它给出了作为表面法线与光源方向夹角函数的反射光比例。

> [!INFO] 
> 关于负数的处理
> 请注意，当角度超过 $90$ 度时，$\cos(\alpha)$ 的值会变为负数。如果我们盲目使用这个值，可能会导致光源使表面变得更暗！这在物理上是没有意义的；超过 $90$ 度的角度仅表示光源实际上是在照亮表面的背面，因此它对被照亮点不贡献任何光线。所以，**如果 $\cos (\alpha)$ 变为负数，我们需要将其视为 $0$**。

#### 漫反射方程

现在我们可以建立一个方程来计算场景中法向量为 $\overrightarrow{N}$ 的一个点 $P$ 接收到的总光量，该场景具有环境光强度 $I_{A}$ 和 $n$ 个点光源或方向光源，其强度为 $I_{n}$ 和光向量 $\overrightarrow{L_{n}}$（对于方向光源已知，对于点光源则针对 $P$ 计算）:
$$
I_{p} = I_{A} + \sum_{i=1}^{n} I_{i} \frac{(\overrightarrow{N},\overrightarrow{L_{i}})}{|\overrightarrow{N}||\overrightarrow{L_{i}}|}
$$

值得再次被强调的是：当 $(\overrightarrow{N},\overrightarrow{L_{i}}) < 0$, 这些项不应该被加入该点的光照效果。

#### 球体法线

还有一个小细节缺失：法线从哪里来？这个问题的答案比表面上看起来要复杂得多，我们将在本书的第二部分看到这一点。幸运的是，目前我们只处理球体，对于球体而言，答案非常简单：**球体上任意一点的法向量位于一条穿过球心的直线上**。如下图所示，如果球心为 $C$，则点 $P$ 处的法线方向为 $P-C$。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216142158.png)

为什么是“法线的方向”而不是“法线”？法线向量需要垂直于表面，但它还需要长度为 1。为了将该向量归一化并转换为真正的法向量，我们需要将其除以自身的长度，从而确保结果的长度为 1：
$$
\overrightarrow{N} = \frac{P-C}{|P-C|}
$$

#### 使用漫反射进行渲染

让我们将上述内容翻译为伪代码。首先，我们为场景添加几个光源：

```js title=lightConfig
light {
	type = ambient
	intensity = 0.2
}

light {
	type = point
	intensity = 0.6
	position = (2, 1, 0)
}

light {
	type = directional
	intensity = 0.2
	direction = (1, 4, 4)
}
```

请注意，这些强度值恰好加总为 1.0；由于光照方程的工作方式，这确保了任何点的光照强度都不会超过该值。这意味着我们不会出现任何“<font color="#4dfe50">过曝</font>(overexposed)”的区域。

光照方程很容易转换为伪代码：
```js title=ComputeLighting
ComputeLighting(P, N) {
 	i = 0.0
 	for light in scene.Lights {
 		if (light.type == ambient) {
 			i += light.intensity // ①
 		}
 		else if (light.type == point) {
 			L = light.position - P // ②
 		} else {
 			L = light.direction // ③
 		}
 	
 		n_dot_l = dot(N, L)
 	
 		if (n_dot_l > 0) { // ④
 			i += light.intensity * n_dot_l / (length(N) * length(L))// ⑤
 		}
 	}
 	return i
}
```

在上面的伪代码中，我们对三种类型的光处理方式略有不同。环境光是最简单的，直接处理即可①。点光源和方向光源共享大部分代码，特别是强度计算部分⑤，但它们的方向向量是通过不同方式计算的（②和③），具体取决于光源类型。④中的条件确保我们不会添加负值，这些负值代表照亮表面背面的光源，正如我们之前讨论的那样。

剩下唯一的事情就是在 `TraceRay` 中使用 `ComputeLighting`。我们将返回球体颜色的那行代码：
```
return closest_sphere.color
```

替换为以下片段
```
P = 0 + closest_t * D // 计算交点
N = P - closest_sphere.center // 计算交点处球体的法线
N = N/length(N)

return closest_sphere.color * ComputeLighting(P, N)
```

为了好玩，我们添加一个大黄球：
```
sphere {
	color = (255, 255, 0) //黄色
	center = (0, -5001, 0)
	radius = 5000
}
```

我们运行渲染器，果然，这些球体现在开始看起来像真正的球体。

但等等，那个大的黄色球体是如何变成平坦的黄色地面的呢？其实它并没有变成地面；只是因为它比其他三个球体大得多，而相机离它非常近，所以看起来是平的——就像我们站在地球上时，地球表面看起来也是平的一样。

### 镜面反射

让我们把注意力转向闪亮的物体。与哑光物体不同，闪亮的物体看起来会因观察角度的不同而略有不同。

想象一个台球或刚从洗车房出来的汽车。这类物体呈现出非常特定的光照模式，通常是明亮的光斑，当你围绕它们移动时，这些光斑似乎也在随之移动。与漫反射物体不同，你对这类物体表面的感知确实**取决于你的观察角度**。

请注意，一个红色的台球无论你如何绕它走动，它本身仍保持红色，但赋予其光泽感的明亮白色光斑却随着你的移动而移动。这表明我们想要模拟的新效果**并非取代漫反射，而是对其加以补充。**

为了理解为何会出现这种现象，让我们更仔细地观察表面如何反射光线。正如前一节所见，当一束光线照射到漫反射物体的表面时，它会向各个方向均匀地散射回场景中。这是因为物体表面不平整，因此在微观层面上，它表现为一组朝向随机方向的微小表面，如下图：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216150315.png)

但如果表面并非那么不规则呢？让我们走向另一个极端：一块完美抛光的镜子。当一束光线照射到镜子上时，它会朝单一方向反射。如果我们称反射光线的方向为 $\overrightarrow{R}$，并保持 $\overrightarrow{L}$ 指向光源的约定，**下图**便说明了这种情况。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216150547.png)

根据表面“抛光”的程度不同，它或多或少地表现出镜面反射的特性；这就是为什么这种反射被称为镜面反射(specular reflection)，源自拉丁语“speculum”，意为“镜子”。

对于一个完美的抛光镜面，入射光线 $\overrightarrow{L}$ 会反射到单一方向 $\overrightarrow{R}$。这就是你能够非常清楚地看到反射物体的原因：并非对于每一条入射光线 $\overrightarrow{L}$, 都存在一条唯一的反射光线 $\overrightarrow{R}$。虽然大部分光线仍然在 $\overrightarrow{R}$ 方向反射，但也会有部分光线在接近 $\overrightarrow{R}$ 的方向反射。离 $\overrightarrow{R}$ 越近，反射在该方向的光线越多，如下图所示。物体的“光泽度”决定了反射光线随远离 $\overrightarrow{R}$ 的距离而迅速减少的速度。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216152625.png)


我们想要弄清楚有多少来自 $\overrightarrow{L}$ 的光线反射回我们的观察方向。如果 $\overrightarrow{V}$ 是“观察向量”，从 $P$ 指向相机，并且 $\alpha$ 是 $\overrightarrow{R}$ 和 $\overrightarrow{V}$ 之间的角度，我们得到下图：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216150854.png)

当 $\alpha = 0°$ 时，所有光线都沿 $\overrightarrow{V}$ 方向反射。当 $\alpha = 90°$ 时，没有光线被反射。与漫反射一样，我们需要一个数学表达式来确定 $\alpha$ 的中间值会发生什么。

#### 建模镜面反射

在本章开头，我提到某些模型并非基于物理模型。这便是其中之一。以下模型是任意设定的，但因其计算简便且视觉效果良好，因而被广泛采用。

考虑 $\cos (\alpha)$。它具有我们所需的优良特性：$\cos (0) = 1$，$\cos(\pm90) = 0$；并且在 0 到 90 度之间，其值呈令人愉悦的平滑曲线逐渐减小，如下图所示。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216151332.png)

这意味着 $\cos (\alpha)$ 满足我们对镜面反射函数的所有要求，为什么不直接使用它呢？

还有一个细节需要注意。如果我们直接使用这个公式，所有物体的光泽度都会相同。我们该如何修改这个方程，以表示不同层次的光泽度？

请记住，**光泽度衡量的是反射函数随α增大而减小的速度**。一种简单的方法是计算 $\cos(\alpha)$ 的某个正指数 $s$ 次幂。由于 $0 \leq cos(\alpha) \leq 1$，我们保证 $0 \leq cos(\alpha)^s \leq 1$；因此 $\cos (\alpha)$ 与 $\cos (\alpha)^s$ 类似，只是“更窄”。下图展示了不同 $s$ 值下 $\cos ()\alpha)$ 的图像:

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216151724.png)


$s$ 值越大，函数在 $0$ 点附近的“宽度”越窄，物体看起来也越亮。$s$ 被称为<font color="#4dfe50">镜面指数</font>(specular exponent)，是表面的一个属性。由于该模型并非基于物理现实，s 的取值只能通过反复试验来确定——即不断调整数值，直到视觉效果“看起来合适”。对于基于物理的模型，您可以查阅双向反射分布函数（BDRF）。

让我们将上述内容整合起来。一束光线以镜面指数 $s$ 照射到表面点 $P$，该点的法向量为 $\overrightarrow{N}$，入射方向为 $\overrightarrow{L}$。有多少光线被反射向观察方向 $\overrightarrow{V}$？

根据我们的模型，该值为 $\cos(\alpha)^s$，其中 $\alpha$ 是 $\overrightarrow{V}$ 与 $\overrightarrow{R}$ 之间的夹角；$\overrightarrow{R}$ 是 $\overrightarrow{L}$ 关于 $\overrightarrow{N}$ 反射后的结果。因此，第一步是根据 $\overrightarrow{N}$ 和 $\overrightarrow{L}$ 计算 $\overrightarrow{R}$ 。

我们可以将 $\overrightarrow{L}$ 分解为两个向量 $\overrightarrow{L_{p}}$ 和 $\overrightarrow{L_{n}}$。使得 $\overrightarrow{L} = \overrightarrow{L_{p}} + \overrightarrow{L_{n}}$ ,其中 $\overrightarrow{L_{N}}$ 平行于向量 $\overrightarrow{N}$，且 $\overrightarrow{L_{P}}$ 垂直于 $\overrightarrow{N}$ 。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216154039.png)


$\overrightarrow{L_{N}}$ 是 $\overrightarrow{L}$ 在 $\overrightarrow{N}$ 上的投影；根据点积的性质以及 $|\overrightarrow{N}| = 1$ 的事实，这个投影的长度是 $(\overrightarrow{N},\overrightarrow{L})$。我们定义 $\overrightarrow{L_{N}}$ 与 $\overrightarrow{N}$ 平行，所以 $\overrightarrow{L_{N}} = \overrightarrow{N}(\overrightarrow{N},\overrightarrow{L})$。

由于 $\overrightarrow{L} = \overrightarrow{L_{P}} + \overrightarrow{L_{N}}$，我们可以立即得到 $\overrightarrow{L_{P}} = \overrightarrow{L} - \overrightarrow{L_{N}} = \overrightarrow{L} - \overrightarrow{N}(\overrightarrow{N}, \overrightarrow{L})$。

现在让我们看看 $\overrightarrow{R}$。由于它关于 $\overrightarrow{N}$ 与 $\overrightarrow{L}$ 对称，它平行于 $\overrightarrow{N}$ 的分量与 $\overrightarrow{L}$ 的相同，而它垂直的分量与 $\overrightarrow{L}$ 的相反；即 $\overrightarrow{R} = \overrightarrow{L_{N}}-\overrightarrow{L_{P}}$。如下图所示：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251216155018.png)

代入我们上面找到的表达式，我们得到：
$$
\overrightarrow{R} = \overrightarrow{N}(\overrightarrow{N},\overrightarrow{L}) - \overrightarrow{L}+\overrightarrow{N}(\overrightarrow{N},\overrightarrow{L})
$$
并且稍作简化：
$$
\overrightarrow{R} = 2\overrightarrow{N}(\overrightarrow{N},\overrightarrow{L}) - \overrightarrow{L}
$$

#### 镜面反射项

我们现在可以写出镜面反射公式了:
$$
\overrightarrow{R} = 2\overrightarrow{N}(\overrightarrow{N},\overrightarrow{L}) - \overrightarrow{L}
$$
$$
I_{s} = I_{L}\left( \frac{\overrightarrow{R},\overrightarrow{V}}{|\overrightarrow{R}||\overrightarrow{V}|} \right)^s
$$

与漫反射光照类似，$\cos (\alpha)$ 的值也可能是负数，我们应出于同样的原因忽略它。此外，并非所有物体都需要具有光泽；对于哑光物体，不应计算其镜面反射项。我们将在场景中通过将这些物体的镜面指数设置为 $-1$，并相应地处理它们来体现这一点。

#### 完整的光照方程

我们可以将镜面反射项添加到我们一直在发展的光照方程中，从而得到一个单一的表达式，用于描述某一点的光照：
$$
I_P = I_A + \sum_{i=1}^{n} I_i \cdot \left[ \frac{\langle \vec{N}, \vec{L}_i \rangle}{|\vec{N}||\vec{L}_i|} + \left( \frac{\langle \vec{R}_i, \vec{V} \rangle}{|\vec{R}_i||\vec{V}|} \right)^{s} \right]
$$
其中 $I_{P}$ 是点 $P$ 处的总光照强度，$I_{A}$ 是环境光的强度，$N$ 是点 $P$ 处表面的法线，$V$ 是从点 $P$ 指向摄像机的向量，$s$ 是表面的镜面指数，$I_{i}$ 是第 $i$ 个光源的强度，$L_{i}$ 是从点 $P$ 指向第 $i$ 个光源的向量，$R_{i}$ 是点 $P$ 处针对第 $i$ 个光源的反射向量。

#### 使用镜面反射进行渲染

让我们为到目前为止一直在处理的场景添加镜面反射。首先，对场景本身进行一些修改：
```js
sphere {
	center = (0, -1, 3)
	radius = 1
	color = (255, 0, 0) //red
	specular = 500  // shiny 
}

sphere {
	center = (2, 0 ,4)
	radius = 1
	color = (0, 0, 255) // blue
	specular = 500
}

sphere {
	center = (-2, 0, 4)
	radius = 1
	color = (0, 255, 0) //green
	specular = 10
}

sphere {
	center = (0, -5001, 0)
	radius = 5000
	color = (255, 255, 0)
	specular = 1000
}
```

这是与之前相同的场景，但为球体定义增加了镜面指数。

在代码层面，我们需要修改 `ComputeLighting` 函数，使其在必要时计算镜面项，并将其加入整体光照。请注意，该函数现在需要 $\overrightarrow{V}$ 和 $s$:
```js
ComputeLighting(P, N, V, s) {
	i = 0.0
	for light in scene.Lights {
		if light.type == ambient {
			i += light.intensity
		} else if (light.type == point) {
			L = light.position - P
		} else {
			L = light.direction
		}
		
		// diffuse
		n_dot_l = dot(N, L)
		if (n_dot_l > 0) {
			i += light.intensity * n_dot_l/(length(N) * length(L))
		} 
		
		// specular
		if (s!=-1) { // ①
			R = 2 * N * dot(N, L) - L
			r_dot_v = dot(R, V)
			if(r_dot_v > 0) { // ②
				i += light.intensity * pow(r_dot_v/(length(R) * length(V)), s)
			}
		}
	}
	return i
}
```

大部分代码保持不变，但我们添加了一段代码来处理镜面反射。我们确保它仅应用于光滑物体①，同时也要确保不添加负的光照强度②，正如我们在漫反射中所做的那样。

最后，我们需要修改 `TraceRay`，以便将新参数传递给 `ComputeLighting `。$s$ 是直接从场景定义中获取的。但向量 $\overrightarrow{V}$ 来自哪里呢？

$\overrightarrow{V}$ 是从物体指向相机的向量。幸运的是，我们在 `TraceRay` 中已经有一个从相机指向物体的向量——那就是 $\overrightarrow{D}$，即我们正在追踪的射线的方向！因此, $\overrightarrow{V}$ 就是 $\overrightarrow{-D}$。

下面是新的 `TraceRay`：
```js title = TraceRay
TraceRay(O, D, t_min, t_max) {
	closest_t = inf
	closest_sphere = NULL
	for sphere in scene.Spheres {
		t1, t2 = IntersectRaySphere(O, D, sphere)
		if t1 in [t_min, t_max] and t1 < closest_t {
			closest_t = t1
			closest_sphere = sphere
		}
		if t2 in [t_min, t_max] and t2 < closest_t {
			closest_t = t2
			closest_sphere = sphere
		}
	}
	
	if closest_sphere == NULL {
		return BACKGROUND_COLOR
	}
	
	P = O + closest_t * D //计算交点
	N = P - closest_sphere.center // 计算球体在交点的法线
	N = N / length(N)
	return closest_sphere.color * ComputeLighting(P, N, -D, closest_sphere.specular) // ①
}
```

颜色计算 ① 比看起来要复杂一些。请记住，颜色必须按通道相乘，且结果必须限制在通道的范围内（在我们的情况下，[0–255]）。虽然在示例场景中，光照强度总和为 1.0，但现在我们加入了镜面反射的贡献，这些值可能会超出该范围。

## 阴影与反射

在上一节中，我们建模了光线如何与表面相互作用。在本章中，我们将建模光线与场景相互作用的两个方面：物体投射阴影以及物体在其他物体上产生反射。

### 阴影

只要有光源和物体，就会有阴影。我们有光源和物体。那么我们的阴影在哪里？

#### 理解阴影

让我们从一个更根本的问题开始：为什么要有阴影？阴影的产生是因为存在一束光线无法照射到某个物体，因为有其他物体挡在了中间。

在上一章中，我们只关注了光源与表面之间非常局部的相互作用，而忽略了场景中其他所有发生的事情。要产生阴影，我们需要采取更全局的视角，考虑光源、我们想要绘制的表面以及其他场景中存在的物体之间的相互作用。

从概念上讲，我们想要实现的目标相对简单：我们希望添加一小段逻辑，其含义是“**如果在该点与光源之间存在物体，则不要添加来自该光源的照明**”。如下图所示：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251217090421.png)

事实证明，我们已经拥有了完成此操作所需的所有工具。我们从一个方向光源开始。我们知道点 $P$，即我们感兴趣的点。我们也知道向量 $\overrightarrow{L}$，这是光源定义的一部分。已知点 $P$ 和向量 $\overrightarrow{L}$，我们就可以定义一条射线，即 $P+t\overrightarrow{L}$，该射线从表面的点延伸至无限远处的光源。这条射线是否与其他物体相交？如果相交，则说明点与光源之间存在遮挡，该点处于阴影中，因此我们忽略该光源的照明效果；如果不相交，则说明点与光源之间无遮挡，我们按之前的方法计算该光源的照明效果。

我们已经知道如何计算光线与球体之间的最近交点：即我们用于从相机发出光线的 `TraceRay` 函数。我们可以重用其中大部分内容来计算光线与场景其余部分之间的最近交点。

不过，该函数的参数略有不同:
- 光线不再从相机开始，而是从点 P 开始。
- 光线的方向不再是 $(V-O)$，而是 $\overrightarrow{L}$ 。
- 我们不希望位于 $P$ 点后方的物体在 $P$ 点上投下阴影，因此需要 $t_{min}=0$ 。
- 由于我们处理的是方向性光源（无限远），即使是非常遥远的物体仍应能在 $P$ 点上投下阴影，因此 $t_{max=+\infty}$ 。

下图显示了两个点：$P_{0}$ 和 $P_{1}$ 。当从 $P_{0}$ 点沿光源方向追踪射线时，我们发现该射线与任何物体均无交点；这意味着光源可以到达 $P_{0}$ 点，因此 $P_{0}$ 点没有阴影。对于 $P_{1}$ 点，我们发现射线与球体有两个交点，且 $p>0$（表示交点位于物体表面与光源之间）；因此，该点处于阴影中。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251217091706.png)

我们可以以非常类似的方式处理点光源，但有两个例外。首先, $\overrightarrow{L}$ 向量并非恒定不变，但我们已经知道如何根据 $P$ 点和光源的位置来计算它。其次，我们不希望距离光源较远的物体能够对 $P$ 点投下阴影，因此在这种情况下我们需要 $t=1$，使得光线“在光源处停止”。

下图展示了这些情况。当我们从 $P_{0}$ 点沿 $\overrightarrow{L_{0}}$ 方向发射一条射线时，会发现它与小球相交；然而，这些交点的 $t$ 值大于 1，意味着它们并不位于光源与 $P_{0}$ 点之间，因此我们忽略它们。因此，$P_{0}$ 点没有处于阴影中。另一方面，从 $P_{1}$ 点沿 $\overrightarrow{L_{1}}$ 方向发出的射线与大球相交，且 $0<t<1$，因此该球体在 $P_{1}$ 点投下了阴影。

我们还需要考虑一个字面意义上的边界情况。考虑射线 $P+t\overrightarrow{L}$。如果我们从 $t=0$ 开始寻找交点，我们会发现一个交点就在 $P$ 点本身！我们知道 $P_{0}$ 点位于一个球体上，因此当 $t=0$ 时，$P+t\overrightarrow{L}=P$；换句话说，每个点都会对自己投下阴影！

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251217094522.png)

最简单的解决方法是将 $t$ 设为一个非常小的值 $\epsilon$，而不是 0。从几何意义上讲，我们希望射线从 P 点所在表面的极小偏移处开始，而不是恰好从 P 点开始。因此，对于平行光，$t$ 的取值范围为 $[\epsilon,+\infty]$；对于点光源，$t$ 的取值范围为 $[\epsilon,1]$。

可能会让人想通过简单地不计算光线与球体 $P$ 所属的球体之间的交点来解决这个问题。这对球体来说是可行的，但对于形状更复杂的物体则会失败。例如，当你用手遮挡阳光保护眼睛时，你的手会在脸上投下阴影，而这两个表面都属于同一个物体——你的身体。

#### 带阴影的渲染

让我们将上述讨论转化为伪代码。

在之前的版本中，`TraceRay` 计算光线与球体的最近交点，然后在交点处计算光照。我们需要提取最近交点的计算代码，因为我们要重用它来计算阴影。
```js
ClosestIntersection(O, D, t_min, t_max) {
	closest_t = inf
	closest_sphere = NULL
	for sphere in scene.Spheres {
		t1, t2 in IntersectRaySphere(O, D, sphere) {
			if t1 in [t_min, t_max] and t1 < closest_t {
				closest_t = t1
				closest_sphere = sphere
			}
			if t2 in [t_min, t_max] and t2 <　closest_t {
				closest_t = t2
				closest_sphere = sphere
			}
		}
	}
	
	return closest_sphere, closest_t
}
```

我们可以重写 `TraceRay` 函数以复用该函数，其结果版本要简单得多

```js
TraceRay(O, D, t_min, t_max) {
	closest_sphere, closest_t = ClosestIntersection(O, D, t_min, t_max)
	if(closest_sphere == NULL) {
		return BACKGROUND_COLOR
	}
	P = O + closest_t * D
	N = P - closest_sphere.center
	N = N / length(N)
	return closest_sphere.color * ComputeLighting(P, N, -D, closest_sphere.specular)
}
```

然后，我们需要再 `ComputeLighting` 中添加阴影检查①

```js
ComputeLighting(P, N ,V, s) {
	i = 0.0
	for light in scene.Lights {
		if(light.type == ambient) {
			i += light.intensity
		} else if(light.type == point) {
			L = light.position - P
		} else {
			L = light.direction
			t_max = inf
		}
		
		// shadow check
		shadow_sphere, shadow_t  = ClosestIntersection(P, L, 0.001, t_max)
		if(shadow_sphere != NULL) {
			continue
		}
		
		// diffuse
		n_dot_l = dot(N, L)
		if(n_dot_l > 0) {
			i += light.intensity * n_dot_l / (length(N) * length(L))
		}
		
		// Specular
		if(s!=-1) {
			R = 2 * N * dot(N, L) - L
			r_dot_v = dot(R,V)
			
			if(r_dot_v > 0) {
				i += light.intensity * pow(r_dot_v / (length(R) * length(V)), s)
			}
		}
	}
	
	return i
}
```

现在我们已经取得了一些进展。场景中的物体以更真实的方式相互作用，彼此投射阴影。接下来我们将探索更多物体间的互动——即物体反射其他物体。

### 反射

在上一节中，我们讨论了“镜面”般的表面，但这仅赋予它们闪亮的外观。我们能否拥有看起来像真正镜子的物体——即，能否在它们表面看到其他物体的反射？可以，事实上在光线追踪器中实现这一点异常简单，但当你第一次看到其工作原理时，可能会感到令人困惑。

#### 镜子与反射

让我们看看镜子是如何工作的。当你看镜子时，你所看到的是从镜面反射回来的光线。**光线会相对于表面法线对称反射**，如下图所示：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20251217103238.png)

假设我们正在追踪一条光线，而最近的交点恰好是镜面。这条光线的颜色是什么？它不是镜面本身的颜色，因为我们看到的是反射光。因此，我们需要弄清楚这束光是**从哪里来的**，以及**它的颜色是什么**。所以我们只需计算反射光线的方向，并确定从该方向射来的光的颜色即可。

如果我们有一个函数，给定一条光线，就能返回从该方向射来的光的颜色……就好了。

等等！我们确实有这样一个函数，它的名字叫 `TraceRay`！

在主循环中，对于每个像素，我们从相机向场景创建一条射线，并调用 `TraceRay` 来确定相机在该方向上“看到”的颜色。如果 `TraceRay` 判断相机看到的是镜面，它只需计算反射射线的方向，并确定从该方向传来的光线颜色；它必须调用……**自身**。

此时，我建议你再重新阅读最后几段，直到彻底理解为止。如果你第一次接触递归光线追踪，可能需要多读几遍，甚至多花些时间思考，才能真正掌握其中的精髓。

当我们设计一个递归算法（即调用自身的算法）时，必须确保不会引发无限循环（也即常说的“此程序已停止响应，是否要终止？”）。该算法有两个自然的终止条件：一是**光线击中了非反射性物体**，二是**光线未击中任何物体**。但存在一种简单情况可能导致无限循环：<font color="#4dfe50">无限走廊效应</font>(the infinite hall effect)。这发生在你将一面镜子置于另一面镜子前并凝视镜中时——你会看到无限多个自己的影像！为防止无限递归，我们只需在算法中引入一个递归限制；这将控制算法能“深入”的程度。我们称其为 $r$。当 $r=0$ 时，我们能看到物体但看不到反射；当 $r=1$ 时，我们能看到物体以及部分物体表面的反射。

当 $r=2$ 时，我们能看到物体、某些物体的反射，以及某些物体反射的反射（对于更大的 r 值，以此类推）。通常来说，深入到三层以上并无太大意义，因为在该点上差异几乎难以察觉。

我们将做另一个区分。“反射性”不必是全有或全无的命题；物体可能仅部分反射。我们将为每个表面分配一个 0 到 1 之间的数值，表示其反射程度。然后，我们将使用该数值作为权重，计算局部照明颜色与反射颜色的加权平均值。

最后，对 TraceRay 的递归调用需要哪些参数？
- 射线从物体表面 P 点开始。
- 反射射线的方向是入射射线在 $P$ 点反弹后的方向；在 `TraceRay` 中，我们有 $\overrightarrow{D}$，即指向 $P$ 点的入射射线方向，因此反射射线的方向是 $\overrightarrow{D}$ 相对于 $\overrightarrow{N}$ 的反射方向。
- 类似于阴影的情况，我们也不希望物体反射自身，因此 $t_{min}=\epsilon$。
- 我们希望无论物体有多远，都能看到其反射，因此 $t_{max}=+\infty$。
- 递归限制比当前递归限制少一（以避免无限递归）。

现在，我们准备将上述内容转化为实际的伪代码。

#### 带反射的渲染

让我们为我们的光线追踪器添加反射效果。首先，我们通过为每个表面添加一个反射属性来修改场景定义，该属性描述表面的反射程度，从 $0.0$（完全不反射）到 $1.0$（完美镜面）：

```js
sphere {
	center = (0, -1, 3)
	radius = 1
	color = (255, 0, 0) // red
	specular = 500 // Shiny
	reflective = 0.2
}

sphere {
	center = (-2, 1, 3)
	radius = 1
	color = (0, 0, 255)
	specular = 500
	reflective = 0.3
}

sphere {
	center = (2, 1, 3)
	radius = 1
	color = (0, 255, 0)
	specular = 10
	reflective = 0.4
}

sphere {
	color = (255, 255, 0)
	center = (0, -5001, 0)
	radius = 5000
	specular = 1000
	reflective = 0.5
}
```

我们在计算镜面反射时已经使用了“反射射线”公式，因此可以将其提取出来。该公式接收一条射线 $\overrightarrow{R}$ 和一个法线 $\overrightarrow{N}$，并返回相对于 $\overrightarrow{N}$ 反射后的射线 $\overrightarrow{R}$。

```js
ReflectRay(R, N) {
	return 2 * N * dot(N, R) -R
}
```

我们需要对 `ComputeLighting` 做的唯一修改，就是用对这个新 `ReflectRay` 的调用替换反射方程。

主方法中有一个小改动——我们需要将递归限制传递给顶层的 `TraceRay` 调用：

```js
color = TraceRay(O, D, 1, inf, recursion_depth)
```

正如之前讨论的，我们可以将 `recursion_depth` 的初始值设置为一个合理的值。

唯一显著的改动发生在 `TraceRay` 函数末尾，即递归计算反射的地方。

```js
TraceRay(O, D, t_min, t_max, recursion_depth) {
	closest_sphere, closest_t = ClosestIntersection(O, D, t_min, t_max)
	
	if(closest_sphere == NULL) {
		return BACKGROUND_COLOR
	}
	
	// compute local color
	P = O + closest_t * D
	N = P - closest_sphere.center
	N = N / length(N)
	
	local_color = closest_sphere.color * ComputeLighting(P, N, -D, closest_sphere.specular)
	
	r = closest_sphere.reflective  // ①
	if(recursion_depth <= 0 or r <=0) {
		return local_color
	}
	
	R = ReflectRay(-D, N)
	
	reflected_color = TraceRay(P, R, 0.001, inf, recursion_depth - 1)  // ②
	
	return local_color * (1-r) + reflected_color * r
}
```

代码的修改出乎意料地简单。首先，我们检查是否需要计算反射①。如果球体不具备反射性，或已达到递归限制，我们便无需继续，只需直接返回球体自身的颜色即可。

最有趣的变化是递归调用②；`TraceRay` 会以适当的反射参数调用自身，并且重要的是，递归深度计数器会递减；这一操作结合检查①，可有效防止无限循环。

最后，一旦我们获得了球体的局部颜色和反射颜色，便将两者混合③，混合权重由“该球体的反射程度”决定。
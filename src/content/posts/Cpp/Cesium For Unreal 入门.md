---
title: Cesium For Unreal 入门
description: CesiumForUnreal插件的入门使用。
published: 2026-01-30
pinned: false
tags:
  - Cpp
  - UE5
draft: false
category: Cpp
created: 2026-01-29
---
# 初始化项目

## 先决条件

在阅读本文之前，请确保您安装了 Unreal 引擎（这里安装的是 5.2.1 版本）和 Cesium for Unreal 插件，并且有一个 Cesium ion 账号可供使用。

## 创建项目

1. 打开 Unreal 引擎，选择**游戏**，然后选择**空白**。选择合适的位置和项目名称，点击**创建**。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130091259.png)

2. 项目启动后，需要激活 Cesium for Unreal 插件。在顶部菜单中，点击**编辑**，然后选择**插件**。在弹出的窗口中搜索 "Cesium"，勾选 "Cesium for Unreal" 并点击**立即重启**。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130091613.png)

3. 在首次重新启动使用 Cesium for Unreal 插件激活的编辑器时，您可能会遇到与**水体碰撞配置文件**相关的错误。点击**添加条目到 DefaultEngine.ini** 链接修复此错误。

![PixPin_2026-01-30_09-18-17.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_09-18-17.png)

## 准备项目和关卡

1. 创建一个新关卡（**文件** -> **新建关卡**）。在弹出的窗口中，选择“空白关卡”以确保关卡中没有对象，然后点击**创建**：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130092116.png)

2. 禁用场景边界检查。该选项位于**世界场景设置**（**窗口**->**世界场景设置**->**高级**），取消勾选**启用场景边界检查**：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130092443.png)

3. 在打开的 Cesium 面板中（如果没有打开，可以通过**窗口**-> **Cesium** 打开）：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130092740.png)

你需要添加一些照明，以便在后续步骤中能够看到你添加的瓦片集。Cesium for Unreal 附带了一个预先制作好的、与地球相关的太阳和大气系统，名为 **CesiumSunSky**。

4. 您可以直接从 Cesium 面板将 Cesium for Unreal 角色添加到您的关卡中。在面板的“快速添加基本角色”部分，找到 **Cesium SunSky** 并点击按钮将其添加到关卡中。您应该会在视图中看到一个类似天空的渐变效果。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130092843.png)

![PixPin_2026-01-30_09-29-10.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_09-29-10.png)

> [!TIP] 解决视口纯白的问题
> 在添加了 Cesium SunSky 之后，你的视口是否变成了纯白色并且保持这种状态？CesiumSunSky 使用的是逼真的光照强度值，这比标准 Unreal 项目要亮得多。因此，在某些项目设置下，光线会使场景失真并使其呈现白色。要解决这个问题，请在**默认设置**设置选项中启用**自动曝光**和**拓展自动曝光中的默认亮度范围**。你可以通过前往**编辑** -> **项目设置**，然后导航到**引擎** -> **渲染**，并向下滚动到**默认设置**部分来找到这些选项。
> ![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130093335.png)
> 或者，你可以将太阳光照的强度降低到一个更合理但不太真实的值。点击 CesiumSunSky 角色。在细节面板中，找到方向光组件并将光的强度降低到 10.0。

5. 现在保存关卡。点击编辑器左上角**文件**的**保存当前关卡**按钮，或按 Ctrl+S。给你的关卡命名。你也可以将新关卡设置为项目的默认地图。这将确保你的关卡在重启项目或包并运行应用程序时自动打开。在“**编辑** -> **项目设置**”窗口的左侧边栏中，点击“**地图与模式**”，然后查找“**默认地图**”部分。将“**编辑器开始地图**”和“**游戏默认地图**”都更改为你的新关卡。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130093540.png)

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130093643.png)

## 连接到 Cesium ion

1. 返回您在上一步中打开的 Cesium 面板。点击 Connect to Cesium ion 按钮。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130093801.png)

2. 打开一个弹出式浏览器窗口。如果您未登录，请登录您的 Cesium ion 账户。

3. 登录后，你会看到一个提示，询问是否允许 Cesium for Unreal 访问你的资源。选择允许，然后返回 Unreal Engine 继续。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130093917.png)

## 创建一个地球

1. 使用 Cesium 面板，通过点击该条目旁边的按钮，添加"**Cesium World Terrain + Bing Maps Aerial imagery**"。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130094102.png)

在弹出的面板中，会提示您选择一个 Cesium ion token，点击 Cesium New Project Default Token 即可：

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130094201.png)

地形将出现在关卡中。

![PixPin_2026-01-30_10-28-14.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-28-14.png)


2. 查看右侧的**大纲**。除了你之前添加的 CesiumSunSky 之外，你还会看到各种 Cesium 角色。其中之一，Cesium World Terrain，就是你刚刚创建的瓦片集。另外三个——CesiumCameraManager、CesiumCreditSystemBP 和 CesiumGeoreference——是在你第一次向关卡中添加 3D 瓦片集或地理参考角色时自动创建的。
   
3. 如果尚未选择 Cesium World Terrain，请现在选择它。在**细节**面板中，您将看到更多关于此角色的信息。

这是一个 **Cesium3DTileset** 角色。它将 3D Tiles 数据流到虚幻引擎中，并提供了一种配置该瓦片集的方式。

## 向关卡添加全球 3D 建筑

1. 在 Outliner 中选择 **CesiumGeoreference** 角色。此角色决定您的关卡位于世界中的哪个位置。您可以使用此角色更改关卡的当前纬度、经度和高度。
   
2. 在**细节**面板中，查找 Cesium 类别下的 Origin Latitude、Origin Longitude 和 Origin Height 变量。

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130103037.png)

这些变量的当前值设置为美国科罗拉多州丹佛郊外的山丘。

3. 将这些变量更改为您最喜欢的城市的坐标——或者使用这些坐标前往美国伊利诺伊州芝加哥。
<pre>
Origin Latitude = 41.878101
Origin Longitude = -87.59201
Origin Height = 1000.0
</pre>
![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130103220.png)

输入这些坐标后，您会发现场景已经切换到这个新位置。

![PixPin_2026-01-30_10-32-42.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-32-42.png)

4. 城市看起来非常平坦。Cesium World Terrain 不包含建筑细节。幸运的是，**Cesium OSM Buildings** 可以提供帮助。
   从 **Cesium Quick Add** 面板中，将 **Cesium OSM Buildings**添加到关卡中。
   
   ![PixPin_2026-01-30_10-34-07.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-34-07.png)

接着，您就可以开始探索关卡。在视口右上角将摄像机速度修改为 32，然后按住鼠标右键，可以通过 WASD 来移动。

# 给 OSM Buildings 赋予新的材质

现在我们来实现一个简单的城市扫光材质。

### 材质初步

在内容浏览器面板中，找到左侧 CesiumForUnreal 菜单下的 Materials 文件夹，右键点击 M_CesiumBaseMaterial 材质，选择**复制**，并重命名为 M_CyberpunkCity:

![PixPin_2026-01-30_10-43-50.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-43-50.png)

双击进入这个材质的编辑面板，点击 M_CyberpunkCity 节点，取消勾选**使用材质属性**：

![PixPin_2026-01-30_10-46-25.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-46-25.png)

然后选中 Material Attribute Layers 节点，按下 **Del** 键删除。

接着，我们先来制作一个最简单的纯色材质：
1. 按住键盘的数字 `3` 键，在网格空白处点击**鼠标左键**
2. 不出意外，这会变出一个颜色节点（Constant3Vector）
3. 选中它，并且在左侧的**细节**面板的**常量**右侧的颜色选择框选中一个明亮的青蓝色 (00E5FF)。

![PixPin_2026-01-30_10-50-50.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-50-50.png)

将颜色节点右侧的链接符号连到 M_CyberpunkCity 的基础颜色和自发光颜色：

![PixPin_2026-01-30_10-52-42.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-52-42.png)

点击左上角的应用和保存。

然后我们返回到 Unreal 编辑器的主界面，选中大纲的 Cesium OSM Buildings，在下面的细节面板中，搜索 Material，找到出现在的 Rendering 条目下的 Material 选项，将我们刚刚创建的 M_CyberpunkCity 材质拖动到 Material 处。

然后我们可以看到视口中的建筑模型的颜色变成了我们刚才设置的荧光青绿。

![PixPin_2026-01-30_10-58-12.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/PixPin_2026-01-30_10-58-12.png)

呃，老实说，这一点也不 cool，甚至可以说非常无聊，但幸运的是，我们可以做得更好。

## 更好的材质

我们来制作一个“升降扫描波 (Moving Scanline)”。

扫描波的逻辑是：**用世界坐标的 Z 轴（高度）减去时间，再送入正弦波，就会产生移动条纹。** （如果时间允许，烦请您将这段话读三遍。当然您也可以选择不读，这是您的权力：）

再次双击刚才的 M_CyberpunkCity，选中创建的颜色节点，选择断开节点连接。

现在，让我们开始：

#### 扫光

1. **世界位置（WorldPosition）**
	- 在面板上点击右键，搜索 `worldPosition`
	- 右键搜 `ComponentMask`，在左侧的**细节**面板中的**材质表达式组件掩码**中只勾选 B
	- 将他们相连

2. **控制波长（Scale）**
	- 右键搜 `Divide`
	- 把 `ComponentMask` 连接到 `A`
	- 创建一个常量（按住 `1` 点击），设置为 **5000**（这个数字决定了光波的宽度，数字越大，扫描线越稀疏），连接到 `B`

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130111048.png)

3. **让它移动（Time）**
	- 右键搜 `Time`
	- 右键搜 `Multiply`（乘法），乘一个 **0.5**（创建一个 0.5 常量，这个 0.5 代表扫描速度）（有些类似于"**函数式编程**"）
	- 右键搜索 `Subtract`（减法）
	- 用第二步的“高度结果” **减去** “时间结果”
	- 高度固定，时间变大，结果就会不断偏移，产生移动效果

4. **生成波形（Sine）**
	- 把减法的结果连给一个 `Sine` 节点
	- 这时候会得到一个 `-1` 到 `1` 的波。为了让它更加锐利，连接一个 `Abs`（绝对值），再连接一个 `Power` （幂运算），指数设置为 500（数字越大光带越细，建议 50–500 之间调整）

5. 混合颜色
	- 把这个结果，乘以之前的颜色节点
	- 把结果连到**自发光颜色**

![image.png](https://raw.githubusercontent.com/SilverStr1ng/Images/master/Images/20260130112904.png)

点击**应用**，我们先来看一下效果。

呃，我们看到建筑变黑了，但是，扫描线呢？

这是因为 Cesium 的 SunSky 的光照过于强烈，我们的自发光强度被“淹没”在了强烈的（111000lux）的太阳光中。

点击视口左上角的**光照**，选择"**无光照**"，就能看到制作的扫光效果。

#### 科技网格

现在的扫描线过于单调，我们再给建筑添加一层“网格”：

1. **WorldPosition**
	 - 右键搜 `WorldPosition`
	 - 右键搜 `Divide`，除以 1000（网格大小）

2. **取小数 (Frac)**
	- 连一个 `Frac` 节点
	- 把坐标变成 0-1-0-1 的锯齿波 

3. **生成线条（Step）**
	- 右键搜 `Step`
	- `Frac` 结果连给 `Y` (或者 A/B 取决于版本，通常是 Value)
	- 创建一个常量 **0.9** 连给 `X` (Ref)
	- 只有大于 0.9 的部分保留，其他变黑，这就形成了细线

4. 三维网格混合
	- 因为 Step 输出是 XYZ 三个轴的线。你可以简单粗暴地用 `ComponentMask` 选 R 和 G，然后把它们 **Add (相加)** 起来。

5. 将扫描波和网格用 `Add` 连在一起，然后连给自发光颜色

> [!TIP] 如果想要在光照模式下看到扫光，可以将最终结果乘以一个较大的值来匹配实际的阳光亮度。

## 添加修饰

如果你愿意，可以再给关卡添加一些修饰。

在 Unreal 编辑器的上方菜单中选择**快速添加到项目**，**视觉效果**，**天空大气**和**体积云**。可以给关卡添加默认的大气散射和体积云效果。

## 常见问题

1. **看不到扫光**：先切到“无光照”确认材质是否生效；若生效，回到光照模式后可把自发光结果再乘以更大的系数。
2. **扫描线太密或太宽**：调 `Divide` 的 **5000**（数值越大线越稀疏）。
3. **扫描速度不合适**：调 `Time` 乘的 **0.5**（数值越大越快）。
4. **节点名称找不到**：不同 UE 版本节点命名可能略有差异，可尝试搜索英文关键词。




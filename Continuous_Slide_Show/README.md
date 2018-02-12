# Continuous Slide Show

### outerSlideBody

Here the DIV with class outerSlideBody provides the main holder which is named as "slide1" in the given example.

```
<div class="outerSlideBody col-lg-12" data-name="slide1">
	Body
</div>
```

### Slide
This particular div will be left most visible slide which is identified by data-active=1 but when the last slide is reached then right most slide becomes the active slide
```
<div class="slider " data-active="1" >
	Slide Content
</div>
```

### Controls
Here data-body is used to refer to slide name which this particular span element controls and slide direction is decided by data-slide which be prev (i.e previous) or next
```
<span class="left silde-control" data-body="slide1" data-slide="prev" data-active="1">
	 ( Arrow icon to justife direction or something equivalent ) 
</span>
```

### Example:

![alt text](https://github.com/VamshikShetty/Continuous-Slide-Show/blob/master/example.jpeg)
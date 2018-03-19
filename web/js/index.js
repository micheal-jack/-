$(function() {
    // 初始化swiper,使tab标签过多时，可以滑动
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        initialSlide: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        observer: true,
        observeParents: true
    });
    // configuration();
    // Carousel();
    iframeHeight();
    changeLeft();
    table();
    // 当窗口宽度发生变化时，执行的函数
    $(window).on('resize', function() {
        iframeHeight();
        changeLeft();
        Carousel();
    });
    // 点击展开收起按钮时执行的函数
    $('.btn-up').on('click', function() {
        var Con = $('.concealed'),
            noSkin = $('.no-skin'),
            _this = $(this);
        if (Con.is(':visible')) {
            Con.slideUp(400, function() {
                _this.addClass('btn-down');
                _this.find('.btn-describe').text('展开');

            });
            _this.animate({ 'top': 0 });
            $('iframe,#tab-home').height(noSkin.height());
        } else {
            Con.slideDown(400, function() {
                $('iframe,#tab-home').height(noSkin.height() - 130);
                _this.removeClass('btn-down');
                _this.find('.btn-describe').text('收起');
            });
            _this.animate({ 'top': '75px' });


        }
    });
    // 点击每个标签时，是否自动收起
    $('.nav.nav-tabs li').on('click', function() {
        var json = JSON.parse(localStorage.getItem('order'));
        if (json) {
            var value = json[json.length - 1].fold;
        }
        var Con = $('.concealed'),
            _this = $(this),
            noSkin = $('.no-skin');
        if (value != false) {
            if (!_this.hasClass('homePage')) {
                $('.btn-up').show();
                Con.slideUp(400, function() {
                    $('.btn-up').addClass('btn-down');
                    $('.btn-up').find('.btn-describe').text('展开');
                });
                $('.btn-up').animate({ 'top': 0 });
                $('iframe,#tab-home').height(noSkin.height());
            } else {
                $('.btn-up').hide();
            }
        } else {
            if (!_this.hasClass('homePage')) {
                $('.btn-up').show();
            } else {
                $('.btn-up').hide();
            }
        }
    });

    // 点击个性化设置按钮，出现设置菜单
    $('.btnConfigure').on('click', function() {
        $('.configureWrapper').show();
    });
    // 用户自定义弹框，点击提交时，需要执行的函数
    $('.btn-submit').on('click', function() {
        // 获取标签状态
        var show = $('.configureTable .check option:selected');
        var number = $('.configureTable .number option:selected');
        var fold = $('.fold').prop('checked');
        var list = $('#myTabTitle li');
        var _length = list.length;
        var json = [];
        var arr = [];
        var jsonS;
        // 将用户的自定义显示和顺序存入json
        for (var i = 0; i < _length; i++) {
            var sText = show.eq(i).text();
            var hText = number.eq(i).text();
            arr.push(hText);
            var item = { show: sText, number: hText }
            json.push(item);
        }
        json.push({ fold: fold });
        // 将json存入locaStorage
        jsonS = JSON.stringify(json);
        localStorage.setItem('order', jsonS);
        //查询用户自定义顺序是否重复
        var nary = arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (nary[i] == nary[i + 1]) {
                alert("标签顺序有重复");
                return false;
            }
        }
        var arr2 = [];
        var arr3 = [];
        for (var i = 0; i < list.length; i++) {
            arr2.push(list[i]);
        }
        // 先将标签按初始位置排序
        arr2.sort(function(a, b) {
            return a.getAttribute('data-index') - b.getAttribute('data-index');
        });
        for (var i = 0; i < list.length; i++) {
            arr2[i].setAttribute('data-id', json[i].number);
            if (json[i].show == '否') {
                arr2[i].classList.add('disappear');
            } else {
                arr2[i].classList.remove('disappear');
            }
            arr3.push(arr2[i]);
        }
        arr3.sort(function(a, b) {
            return a.getAttribute('data-id') - b.getAttribute('data-id');
        });
        for (var i = 0; i < list.length; i++) {
            $('#myTabTitle').append(arr3[i]);
        }
        $('.configureWrapper').hide();
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            initialSlide: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            observer: true,
            observeParents: true
        });
        Carousel();
    });
    // 点击隐藏个性化设置菜单
    $('.btn-cancel, .btn-close').on('click', function() {
        $('.configureWrapper').hide();
    });
    // 页面一加载的时候，读取localstorage
    function configuration() {
        var json = JSON.parse(localStorage.getItem('order'));
        var list = $('#myTabTitle li');
        var arr = [];
        if (!json) {
            return false;
        } else if (json.length != list.length + 1) {
            localStorage.removeItem('order');
            json = null;
            return false;
        }
        for (var i = 0; i < list.length; i++) {
            list[i].setAttribute('data-id', json[i].number);
            if (json[i].show == '否') {
                list.eq(i).addClass('disappear');
            } else {
                list.eq(i).removeClass('disappear');
            }
            arr.push(list[i]);
        }
        arr.sort(function(a, b) {
            return a.getAttribute('data-id') - b.getAttribute('data-id');
        });
        for (var i = 0; i < list.length; i++) {
            $('#myTabTitle').append(arr[i]);
        }
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            initialSlide: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            observer: true,
            observeParents: true
        });
        var value = json[json.length - 1].fold;
        $('.fold').prop('checked', value);
        for (var i = 0; i < list.length; i++) {
            var a = json[i].show;
            var b = json[i].number
            $(".configureTable .check").eq(i).val(a);
            $(".configureTable .number").eq(i).val(b);
        }
    }
    // 判断全部标签总长度是否超出父元素，超出显示左右切换按钮
    function Carousel() {
        var list = $('#myTabTitle li');
        var long = 0;
        var wrapper = $('#myTabTitle').width();
        for (var i = 0; i < list.length; i++) {
            if (!list.eq(i).hasClass('disappear')) {
                long += (list.eq(i).width() + 6);
            }
        }
        if (long > wrapper) {
            $('.arrow-right, .arrow-left').show();
        } else {
            $('.arrow-right, .arrow-left').hide();
        }
    }

    // 设置右侧swiper按钮的位置
    function changeLeft() {
        var a = $('.ulWrapper').width() + 65;
        $('.arrow-left').css('left', a);
    }

    // 设定下面显示窗口的高度
    function iframeHeight() {
        var Con = $('.concealed'),
            noSkin = $('.no-skin');
        if (Con.is(':visible')) {
            $('iframe,#tab-home').height(noSkin.height() - Con.height());
        } else {
            $('iframe,#tab-home').height(noSkin.height());
        }
    }
    function table(){
        var list = $('#myTabTitle li');
        for(var i=0;i<list.length;i++){

            var str = '';
            var str2 = '';
            var str3 = '';
            var o = '';
            var b;
            var sss = i;
            var ssss;
            // i=0;我是第一个标签，我要获取首页，即data-index = 1的标签的b.text();
            for(var j=0;j<list.length;j++){

                o = o + '<option>'+ (j+1) +'</option>';
            }
            // for(var j=0;j<list.length;j++){
            //     var data1 = $('#myTabTitle li').eq(j).attr('data-index');
            //     var _this = j;
            //     if(data1==(sss+1)){
            //         ssss = _this;
            //         break;
            //     }
            // }



            b = $("li[data-index=" + (i+1) + "]").find('b').text();


            str = '<td><select class="number">'+ o + '</select></td>';
            str2 = '<td><select class="check"><option>是</option><option>否</option></select></td>';
            str3 = '<td>'+ b +'</td>';
            var str4 = '<tr>' + str3 + str2 + str + '</tr>';
            $('.configureTable tbody').append(str4);
        }
        configuration();
        // 设定下拉框的下拉菜单位置
        $('.number,.check').css('width', '100px').selectmenu({ position: { my: 'left top', at: 'left bottom' } });
        Carousel();
    }

});
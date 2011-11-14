// Copyright (c) 2011 bsheep
// under the MIT License

(function($) {
    $(function() {
        $.fn.create_view = function(option) {
            var container = $(this);
            option = option || {};
            var width = option.width || 5;
            var height = option.height || 5;
            container.css({
                'width': 64 * width,
                'height': 64 * height,
            }).addClass('quarter_container');
            for (var i = 0; i < (width * height); i++) {
                var x = (i % width);
                var y = ~~(i / width);
                var base = $('<div>').addClass('tip').css({
                    'left': 32 * (x - y + width - 1),
                    'top': 16 * (x + y + height - 1)
                }).appendTo(container);
                base.clone().attr({
                    'id': 'qlayer1_' + [x,y].join('_')
                }).appendTo(container);
                base.clone().attr({
                    'id': 'loc_' + [x,y].join('_')
                }).addClass('location').appendTo(container);
                base.addClass('base');
            }
            container.on('mousemove', function(e) {
                var x = e.pageX - container.offset().left;
                var y = e.pageY - container.offset().top;
                $('#mouse').text([x,y].join(':'));
                x -= 32 * (width - 1);
                y -= 16 * (height - 1);
                var X = ~~((x + (2 * y)) / 64) - 1;
                var Y = ~~(((2 * y) - x) / 64);
                $('#quarter').text([X,Y].join(':'));
                $('.location').removeClass('focus');
                $('#loc_' + [X,Y].join('_')).addClass('focus');
                $.data(this, 'mouse', {'x': X, 'y': Y});
            }).on('click', function() {
                var tip = $(this);
                var material = $.data(this, 'material');
                var mouse = $.data(this, 'mouse');
                if (material) {
                    console.log(material);
                    $('#qlayer1_' + [mouse.x, mouse.y].join('_')).css({
                        'background': 'url(' + material.src + ') -' + (material.x * 64) + 'px -' + (material.y * 64) + 'px'
                    });
                }
            });
            return container;
        };
        $.fn.create_palette = function(option) {
            option = option || {};
            var box = $(this);
            var image = box.find('img').get(0);
            var width = image.width;
            var height = image.height;
            for (var i = 0; i < (width / 64); i++) {
                for (var j = 0; j < (height / 64); j++) {
                    var base = $('<div>').addClass('material_tip').attr({
                        'id': 'material_' + [i,j].join('_')
                    }).css({
                        'top': j * 64,
                        'left': i * 64
                    }).on('click', function() {
                        $('.material_tip').removeClass('on');
                        $(this).addClass('on');
                        var id = $(this).attr('id');
                        var id_data = id.split('_');
                        $.data(option.map.get(0), 'material', {
                            'x': id_data[1],
                            'y': id_data[2],
                            'src': image.src
                        });
                    }).on('mouseover', function() {
                        $(this).addClass('focus');
                    }).on('mouseout', function() {
                        $(this).removeClass('focus');
                    }).appendTo(box);
                }
            }
            return box;
        };
    });
})(jQuery);


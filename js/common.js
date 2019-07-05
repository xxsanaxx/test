/** カタカナをひらがなに変換する関数
 * @param {String} src - カタカナ
 * @returns {String} - ひらがな
 */
function katakanaToHiragana(src) {
  return src.replace(/[\u30a1-\u30f6]/g, function(match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/** ひらがなをカタカナに変換する関数
 * @param {String} src - ひらがな
 * @returns {String} - カタカナ
 */
function hiraganaToKatagana(src) {
  return src.replace(/[\u3041-\u3096]/g, function(match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}
//=======================================================
// マウスでの要素のリサイズを可能にする関数
// $('リサイズを行う要素のID').funcResizeBox({
//   minWidth: 0,        // リサイズ可能な最少の幅(px)
//   minHeight: 0,       // リサイズ可能な最少の高さ(px)
//   maxWidth: 10000,    // リサイズ可能な最大の幅(px)
//   maxHeight: 10000,   // リサイズ可能な最大の高さ(px)
//   mouseRange: 10,     // リサイズイベントを取得する範囲(px)
//   isWidthResize:true, // 水平方向のリサイズのON/OFF
//   isHeightResize:true // 垂直方向のリサイズのON/OFF
// });
//=======================================================
(function($){
    $.fn.funcResizeBox = function(userOptions){
        var elements = this;
        var defaults = {minWidth: 0,
                        minHeight: 0,
                        maxWidth: 10000,
                        maxHeight: 10000,
                        mouseRange: 10,
                        isWidthResize:true,
                        isHeightResize:true};

        var option = $.extend(defaults,userOptions);

        $(this).css('resize', 'none');
        $(this).css('overflow', 'auto');
        var pos_left = $(this).offset().left;
        var pos_top = $(this).get(0).offsetTop;
        var pos_right = $(this).outerWidth() + pos_left;
        var pos_bottom = $(this).outerHeight() + pos_top;
        var right_min = pos_right - option.mouseRange;
        var bottom_min = pos_bottom - option.mouseRange;
        var right_flg = false;
        var bottom_flg = false;
        var $box = $(this);
        var resize_flg = false;

        $(this).mousemove(function(e){

            if(resize_flg) return;

            right_flg = false;
            bottom_flg = false;

            pos_left = $box.offset().left;
            pos_top = $box.offset().top;
            pos_right = $box.outerWidth() + pos_left;
            pos_bottom = $box.outerHeight() + pos_top;
            right_min = pos_right - option.mouseRange;
            bottom_min = pos_bottom - option.mouseRange;

            var pagex = window.event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
            var pagey = window.event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);

            // right
            if(pagex <= pos_right && right_min <= pagex
                && pos_top <= pagey && pagey <= pos_bottom && option.isWidthResize)
            {
                right_flg = true;
            }
            // bottom
            if(pagex <= pos_right && pos_left <= pagex
                && bottom_min <= pagey && pagey <= pos_bottom && option.isHeightResize)
            {
                bottom_flg = true;
            }

            if(right_flg && bottom_flg)
            {
                $(this).css('cursor','se-resize');
            }
            else if(right_flg)
            {
                $(this).css('cursor','e-resize');
            }
            else if(bottom_flg)
            {
                $(this).css('cursor','n-resize');
            }
            else{
                $(this).css('cursor','auto');
            }
        });

        $(this).mousedown(function(e){

            var resize_right_flg = false;
            var resize_bottom_flg = false;

            var pagex = e.pageX;
            var pagey = e.pageY;
            var boxWidth = $box.width();
            var boxHeight = $box.height();

            if(right_flg){
                resize_right_flg = true;
            }

            if(bottom_flg){
                resize_bottom_flg = true;
            }
            $(document).mousemove(function(e){

                if(!resize_right_flg && !resize_bottom_flg)
                    return;

                $('body').css('cursor', $box.css('cursor'));
                resize_flg = true;

                var addWidth = e.pageX - pagex;
                var resize_width = boxWidth + addWidth
                if(resize_right_flg && resize_width <= option.maxWidth
                                        && option.minWidth <= resize_width){
                    $box.width(resize_width);
                }

                var addheight = e.pageY - pagey;
                var resize_height = boxHeight + addheight
                if(resize_bottom_flg && resize_height <= option.maxHeight
                                        && option.minHeight <= resize_height){
                    $box.height(resize_height);
                }
            }).mouseup(function(){
                $(document).off("mousemove");
                resize_bottom_flg = false;
                resize_right_flg = false;
                resize_flg = false;
                $('body').css('cursor','auto');
            });
        });
        return(this);
    };
})(jQuery);

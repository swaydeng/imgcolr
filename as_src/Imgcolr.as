package  
{
    
    
    import flash.display.Bitmap;
    import flash.display.BitmapData;
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.HTTPStatusEvent;
    import flash.external.ExternalInterface;
    import flash.net.URLRequest;
    import flash.system.LoaderContext;
    import flash.system.Security;
    import flash.utils.setTimeout;
    
            
    /** 
     * A tool for getting the border color of an image.
     * @author Sway Deng
     * Document Class
     */
    public class Imgcolr extends Sprite {  
            
        //--------------------------------------------------------------------------
        //  Private global constants which represent border side
        //--------------------------------------------------------------------------
        private const SIDE_TOP:String = 't'; // top
        private const SIDE_RIGHT:String = 'r'; // right
        private const SIDE_BOTTOM:String = 'b'; // bottom
        private const SIDE_LEFT:String = 'l'; // left
        private const JS_EVENT_TRIGGER:String = 'Imgcolr.trigger';
        private const JS_ACCESSOR:String = 'getColor'; // js can use this as the accessor
        
        //--------------------------------------------------------------------------
        //  Private global variables
        //--------------------------------------------------------------------------
        private var _loaderCtx:LoaderContext;
        private var _eventTrigger:String = JS_EVENT_TRIGGER;
        
        public function Imgcolr () {  
            setTimeout(function ():void {
                
                var paramObj:Object = root.loaderInfo.parameters;
                var allowedDomain:String = paramObj.allowedDomain || null;
                var eventHandler:String = paramObj.eventHandler || null;
                
                _loaderCtx = new LoaderContext(true);
			
                if (allowedDomain) {
                    Security.allowDomain(allowedDomain);
                }                
                if (eventHandler) {
                    _eventTrigger = eventHandler;
                }
                // register the external interface
                ExternalInterface.addCallback(JS_ACCESSOR, getColor);                 
                // tell JS that swf is ready
                dispatchEventToJavascript( { type:'swfReady' } );
                
            }, 500);
        }
        
        private function getColor (url:String, ignore:String=''):void {            
            var ldr:ImageLoader = new ImageLoader(ignore);
            var fileRequest:URLRequest = new URLRequest(url);
            
            ldr.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoadComplete);
            ldr.load(fileRequest, _loaderCtx);
        }
        
        private function onLoadComplete (evt:Event):void { 
            var targetLdr:ImageLoader = evt.currentTarget.loader;
            var ignore:String = targetLdr.ignore;
            var url:String = targetLdr.contentLoaderInfo.url;
            var data:Object = { };
            data.url = url;
            data.ignore = ignore;
            try {
                var bm:Bitmap = Bitmap(targetLdr.content);
                var bmd:BitmapData = bm.bitmapData;                
                var color:String = getBorderColor(bmd, ignore); 
                data.color = color;
                // Got the dominant color of the loaded image's border
                dispatchEventToJavascript({ type:'success', data: data });
            } catch (error:Error) {
                data.errorMsg = error.name;
                dispatchEventToJavascript({ type:'error', data: data });
            }
        }
        
        /**
		 * Broadcast an event to JS
		 * @param evtObj  { type: 'eventType', data: {} }
		 */
        private function dispatchEventToJavascript (evtObj:Object):void {
            if (ExternalInterface.available) {
			    ExternalInterface.call(_eventTrigger, evtObj);
            }
		}
        
   ///==========================================================================================================================
        
        /**
        * Get the dominant color of an image's border
        *  
        * @param bmd The image's bitmapData
        * @param ignore Which border should be ignored, there are 4 kinds of values: 't', 'r', 'b', 'l' 
        * @return The dominant color of an image's border
        *  
        */  
        public function getBorderColor (bmd:BitmapData, ignore:String = ''):String {            
            var mainColorNum:uint = 0;
            var mainColor:String = '#ffffff';
            
            var colors:Object = {};            
            
            bmd.lock();           
            
            if (ignore.indexOf(SIDE_TOP) < 0) { // don't ignore top border
                traverse(bmd, SIDE_TOP, colors);
            }
            if (ignore.indexOf(SIDE_RIGHT) < 0) { // don't ignore right border
                traverse(bmd, SIDE_RIGHT, colors);
            }
            if (ignore.indexOf(SIDE_BOTTOM) < 0) { // don't ignore bottom border
                traverse(bmd, SIDE_BOTTOM, colors);
            }
            if (ignore.indexOf(SIDE_LEFT) < 0) { // don't ignore left border
                traverse(bmd, SIDE_LEFT, colors);
            }   
            
            bmd.unlock();
            
            for (var k:String in colors) {
                var v:uint = colors[k];
                if (v > mainColorNum) {
                    mainColor = k;
                    mainColorNum = v;
                }
            }

            return mainColor;
        }
        /**
        * Traverse the specified border's color
        *  
        * @param bmd The image's bitmapData
        * @param side The specified border to traverse
        * @param colors the JSON Object that is used for storing colors' amount
        *  
        */  
        private function traverse (bmd:BitmapData, side:String, colors:Object):void {
            var x:uint;
            var y:uint;
            var len:uint;
            var width:uint = bmd.width;
            var height:uint = bmd.height;
            
            if (side === SIDE_TOP || side === SIDE_BOTTOM) { // side top or bottom
                y = (side == SIDE_TOP) ? 0 : (height - 1);
                for (x = 0; x < width; x++) {
                    countColor(bmd, x, y, colors);
                }
            } else { // side right or left
                x = (side == SIDE_RIGHT) ? (width - 1) : 0;
                len = height - 1;
                for (y = 1; y < len; y++) {
                    countColor(bmd, x, y, colors);
                } 
            }
        }
        
        // Count the specified point's color
        private function countColor (bmd:BitmapData, x:uint, y:uint, colors:Object):void {
            var argb:uint = bmd.getPixel32(x, y);
            var alpha:uint = (argb >> 24 & 0xFF);
            
            if (alpha < 0x7f) return; // if true, means alpha value is less than 127, ignore this point
            
            var hexColor:String = '#' + argb.toString(16).slice(2); // e.g. 0xff33eedd -> 33eedd
            
            if (colors[hexColor]) {
                colors[hexColor] ++;
            } else {
                colors[hexColor] = 1;
            }
        }
    }   
}
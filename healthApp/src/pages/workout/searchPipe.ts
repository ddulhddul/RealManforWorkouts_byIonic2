import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchPipe'})
export class SearchPipe implements PipeTransform {
  
  transform(arr: any, searchVal: string): any {
      
    if(!arr || arr.length==0) return arr;
    let srch = searchVal.replace(new RegExp('[\\[\\]\(\)\*\\+\\\\\?]','g'), '')
    let reg = new RegExp('('+srch+')','ig');
    return arr.filter(obj=>{
        let nm = obj.WORKOUT_NAME;
        if(searchVal){
            if(!reg.test(nm)) return false;
            obj.dp = nm.replace(reg, '<strong>$1</strong>');
        }else delete obj.dp;
        return true;
    });
  }
}